#!/usr/bin/env bash

__DIR__="$(cd "$(dirname "$BASH_SOURCE")" >/dev/null 2>&1 && pwd)"
source ${__DIR__}/_common.sh
source ${__DIR__}/.env


function create_resource_group {
	printf "Checking existence of ${COLOR_YELLOW}resource group${NC} ${COLOR_BLUE}$1${NC}... "
	res=$(az group show --name $1 2>/dev/null)
	if [[ $? != 0 ]]; then
		echo -e "${COLOR_RED}Missing!${NC}"
		printf "Creating ${COLOR_YELLOW}resource group${NC} ${COLOR_BLUE}$1${NC}... "
		az group create \
			--location ${REGION} \
			--name $1 \
			--output none
	fi
	echo -e "${COLOR_GREEN}OK${NC}"
}

function create_app_service_plan {
	printf "Checking existence of ${COLOR_YELLOW}app-service plan${NC} ${COLOR_BLUE}$2${NC} in resource group ${COLOR_BLUE}$1${NC}... "
	res=$(az appservice plan show --resource-group $1 --name $2)
	if [[ -z ${res} ]]; then
		echo -e "${COLOR_RED}Missing!${NC}"
		printf "Creating ${COLOR_YELLOW}app service plan${NC} ${COLOR_BLUE}$2${NC} in resource group ${COLOR_BLUE}$1${NC}... "
		az appservice plan create \
			--resource-group $1 \
			--name $2 \
			--is-linux \
			--sku ${WEBAPP_SERVICE_PLAN_SKU} \
			--output none
	fi
	echo -e "${COLOR_GREEN}OK${NC}"
}

create_resource_group ${RESOURCE_GROUP_APP}
create_app_service_plan ${RESOURCE_GROUP_APP} ${WEBAPP_SERVICE_PLAN_NAME}
echo -e "All infrastructure tasks ${COLOR_GREEN}completed successfully!${NC}"
