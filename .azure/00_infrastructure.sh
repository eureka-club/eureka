#!/usr/bin/env bash

__DIR__="$(cd "$(dirname "$BASH_SOURCE")" >/dev/null 2>&1 && pwd)"
source ${__DIR__}/_common.sh
source ${__DIR__}/.env

databaseServerFqdn=''

function usage {
	echo -e "Please specify the ${COLOR_BLUE}environment${NC} to provision!

Environments:
  ${COLOR_BLUE}prod${NC} or ${COLOR_BLUE}production${NC}
  ${COLOR_BLUE}staging${NC}

Usage:
  ${COLOR_YELLOW}$0${NC} ${COLOR_BLUE}<environment>${NC}
"
	exit 1
}

function create_resource_group {
	printf "Checking existence of ${COLOR_YELLOW}resource group${NC} ${COLOR_BLUE}$1${NC}... "
	az group show --name $1 --output none 2>/dev/null
	if [[ $? != 0 ]]; then
		echo -e "${COLOR_RED}Missing!${NC}"
		printf "Creating ${COLOR_YELLOW}resource group${NC} ${COLOR_BLUE}$1${NC}...\n"
		az group create \
			--location ${REGION} \
			--name $1 \
			--output none
	fi
	echo -e "${COLOR_GREEN}OK${NC}"
}

function setup_deployment_user {
	printf "> do you want to setup deployment user? (by default not needed) [y/N]: "
	read INP
	if [[ ${INP} == 'y' || $INP == 'Y' ]]; then
		printf "Setting-up ${COLOR_GREEN}deployment user${NC} ${COLOR_BLUE}$1${NC}... "
		az webapp deployment user set \
			--user-name $1 \
			--password "$2" \
			--output none
		echo "done"
	fi
}

function create_sql_server {
	printf "Checking existence of ${COLOR_YELLOW}SQL server${NC} ${COLOR_BLUE}$2${NC} in resource group ${COLOR_BLUE}$1${NC}... "
	az sql server show --resource-group $1 --name $2 --output none 2>/dev/null
	if [[ $? != 0 ]]; then
		echo -e "${COLOR_RED}Missing!${NC}"
		printf "Creating ${COLOR_YELLOW}SQL server${NC} ${COLOR_BLUE}$2${NC}...\n"
		databaseServerFqdn=$(az sql server create \
			--resource-group $1 \
			--name $2 \
			--admin-user $3 \
			--admin-password $4 \
			--query fullyQualifiedDomainName \
			--output tsv)
		echo "done"

		printf "Creating ${COLOR_YELLOW}SQL server firewall rule${NC} ${COLOR_BLUE}default${NC} (allows access from Azure services)...\n"
		az sql server firewall-rule create \
			--resource-group $1 \
			--server $2 \
			--name default \
			--start-ip-address 0.0.0.0 \
			--end-ip-address 0.0.0.0 \
			--output none
		echo "done"

		printf "Creating ${COLOR_YELLOW}SQL server firewall rule${NC} ${COLOR_BLUE}$5${NC}...\n"
		az sql server firewall-rule create \
			--resource-group $1 \
			--server $2 \
			--name $5 \
			--start-ip-address $6 \
			--end-ip-address $7 \
			--output none
		echo "done"
	else
		echo -e "${COLOR_GREEN}OK${NC}"
		databaseServerFqdn=$(az sql server show \
			--resource-group $1 \
			--name $2 \
			--query fullyQualifiedDomainName\
			--output tsv)
	fi
}

function create_database {
	printf "Checking existence of ${COLOR_YELLOW}SQL database${NC} ${COLOR_BLUE}$3${NC} at SQL server ${COLOR_BLUE}$2${NC}... "
	az sql db show --resource-group $1 --server $2 --name $3 --output none 2>/dev/null
	if [[ $? != 0 ]]; then
		echo -e "${COLOR_RED}Missing!${NC}"
		printf "Creating ${COLOR_YELLOW}SQL database${NC} ${COLOR_BLUE}$3${NC}...\n"
		az sql db create \
			--resource-group $1 \
			--server $2 \
			--name $3 \
			--service-objective $4 \
			--output none
	fi
	echo -e "${COLOR_GREEN}OK${NC}"
	echo -e " ${COLOR_BLUE}DATABASE_URL=${COLOR_GREEN}\"sqlserver://${databaseServerFqdn}:1433;database=$3;user=${DATABASE_SERVER_ADMIN_USER}@$2;password=REDACTED\"${NC}\n"
}

function create_app_service_plan {
	printf "Checking existence of ${COLOR_YELLOW}app-service plan${NC} ${COLOR_BLUE}$2${NC} in resource group ${COLOR_BLUE}$1${NC}... "
	res=$(az appservice plan show --resource-group $1 --name $2)
	if [[ -z ${res} ]]; then
		echo -e "${COLOR_RED}Missing!${NC}"
		printf "Creating ${COLOR_YELLOW}app service plan${NC} ${COLOR_BLUE}$2${NC} in resource group ${COLOR_BLUE}$1${NC}...\n"
		az appservice plan create \
			--resource-group $1 \
			--name $2 \
			--is-linux \
			--sku ${SERVICE_PLAN_SKU} \
			--output none
	fi
	echo -e "${COLOR_GREEN}OK${NC}"
}

function create_blob_storage {
	printf "Checking existence of ${COLOR_YELLOW}storage account${NC} ${COLOR_BLUE}$2${NC} in resource group ${COLOR_BLUE}$1${NC}... "
	az storage account show --resource-group $1 --name $2 --output none 2> /dev/null
	if [[ $? != 0 ]]; then
		echo -e "${COLOR_RED}Missing!${NC}"
		printf "Creating ${COLOR_YELLOW}storage account${NC} ${COLOR_BLUE}$2${NC} in resource group ${COLOR_BLUE}$1${NC}...\n"
		az storage account create \
			--resource-group $1 \
			--name $2 \
			--access-tier Hot \
			--min-tls-version TLS1_1 \
			--sku $3 \
			--output none
		connectionString=$(az storage account show-connection-string \
			--resource-group $1 \
			--name $2 \
			--query connectionString \
			-o tsv)

		az storage container create \
			--resource-group $1 \
			--name $4 \
			--connection-string "$connectionString" \
			--public-access blob \
			--output none
	fi
	echo -e "${COLOR_GREEN}OK${NC}"
}

function create_cdn {
	printf "Checking existence of ${COLOR_YELLOW}CDN profile${NC} ${COLOR_BLUE}$2${NC} in resource group ${COLOR_BLUE}$1${NC}... "
	az cdn profile show --resource-group $1 --name $2 --output none 2> /dev/null
	if [[ $? != 0 ]]; then
		echo -e "${COLOR_RED}Missing!${NC}"
		printf "Creating ${COLOR_YELLOW}CDN profile${NC} ${COLOR_BLUE}$2${NC} in resource group ${COLOR_BLUE}$1${NC}...\n"
		az cdn profile create \
			--resource-group $1 \
			--name $2 \
			--sku $3 \
			--output none

		az cdn endpoint create \
			--resource-group $1 \
			--profile-name $2 \
			--name $4 \
			--origin "$5.blob.core.windows.net" \
			--no-http \
			--output none
	fi
	echo -e "${COLOR_GREEN}OK${NC}"
}

function provision_production {
	create_resource_group ${RESOURCE_GROUP_PRODUCTION}
	setup_deployment_user ${DEPLOYMENT_USER} "${DEPLOYMENT_PASSWORD}"
	create_sql_server ${RESOURCE_GROUP_PRODUCTION} ${DATABASE_SERVER_NAME_PRODUCTION} \
		${DATABASE_SERVER_ADMIN_USER} \
		${DATABASE_SERVER_ADMIN_PASSWORD_PRODUCTION} \
		${DATABASE_SERVER_FIREWALL_RULE_NAME} \
		${DATABASE_SERVER_FIREWALL_START_IP_ADDRESS} \
		${DATABASE_SERVER_FIREWALL_END_IP_ADDRESS}
	create_database ${RESOURCE_GROUP_PRODUCTION} ${DATABASE_SERVER_NAME_PRODUCTION} ${DATABASE_NAME_PRODUCTION} ${DATABASE_SKU_PRODUCTION}
	create_app_service_plan ${RESOURCE_GROUP_PRODUCTION} ${SERVICE_PLAN_NAME}
	create_blob_storage ${RESOURCE_GROUP_PRODUCTION} ${STORAGE_ACCOUNT_NAME_PRODUCTION} ${STORAGE_ACCOUNT_SKU_PRODUCTION} ${STORAGE_BLOB_CONTAINER_NAME}
	create_cdn ${RESOURCE_GROUP_PRODUCTION} ${CDN_PROFILE_NAME_PRODUCTION} ${CDN_PROFILE_SKU_PRODUCTION} ${CDN_ENDPOINT_NAME_PRODUCTION} ${STORAGE_ACCOUNT_NAME_PRODUCTION}
	echo -e "\nAll infrastructure tasks ${COLOR_GREEN}completed successfully!${NC}"
}

function provision_staging {
	create_resource_group ${RESOURCE_GROUP_STAGING}
	create_sql_server ${RESOURCE_GROUP_STAGING} ${DATABASE_SERVER_NAME_STAGING} \
		${DATABASE_SERVER_ADMIN_USER} \
		${DATABASE_SERVER_ADMIN_PASSWORD_STAGING} \
		${DATABASE_SERVER_FIREWALL_RULE_NAME} \
		${DATABASE_SERVER_FIREWALL_START_IP_ADDRESS} \
		${DATABASE_SERVER_FIREWALL_END_IP_ADDRESS}
	create_database ${RESOURCE_GROUP_STAGING} ${DATABASE_SERVER_NAME_STAGING} ${DATABASE_NAME_STAGING} ${DATABASE_SKU_STAGING}
	create_blob_storage ${RESOURCE_GROUP_STAGING} ${STORAGE_ACCOUNT_NAME_STAGING} ${STORAGE_ACCOUNT_SKU_STAGING} ${STORAGE_BLOB_CONTAINER_NAME}
	create_cdn ${RESOURCE_GROUP_STAGING} ${CDN_PROFILE_NAME_STAGING} ${CDN_PROFILE_SKU_STAGING} ${CDN_ENDPOINT_NAME_STAGING} ${STORAGE_ACCOUNT_NAME_STAGING}
	echo -e "\nAll infrastructure tasks ${COLOR_GREEN}completed successfully!${NC}"
}


case $1 in
	'prod'|'production')
		provision_production
		;;

	'staging')
		provision_staging
		;;

	'-h'|'--help'|*)
		usage
		;;
esac
