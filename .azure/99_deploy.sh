#!/usr/bin/env bash

__DIR__="$(cd "$(dirname "$BASH_SOURCE")" >/dev/null 2>&1 && pwd)"
source ${__DIR__}/_common.sh
source ${__DIR__}/../.env
source ${__DIR__}/../.env.local
source ${__DIR__}/.env

GIT_DEFAULT_BRANCH='master'
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
GIT_REV=$(git rev-parse HEAD)

deployment_targets=('staging' 'production')
default_target_idx=0


function check_app_service {
	printf "Checking existence of ${COLOR_YELLOW}app-service${NC} ${COLOR_BLUE}$3${NC} in ${COLOR_GREEN}resource group${NC} ${COLOR_BLUE}$1${NC}... "
	az webapp show --resource-group $1 --name $3 --output none 2>/dev/null
	if [[ $? != 0 ]]; then
		echo -e "${COLOR_RED}Missing!${NC}"
		echo -e "Creating ${COLOR_YELLOW}app-service${NC} ${COLOR_BLUE}$3${NC} under ${COLOR_YELLOW}app-service-plan${NC} ${COLOR_BLUE}$2${NC} in ${COLOR_GREEN}resource group${NC} ${COLOR_BLUE}$1${NC}:"
		git_repo=$(az webapp create \
			--resource-group $1 \
			--plan $2 \
			--name $3 \
			--runtime "$4" \
			--deployment-local-git \
			--query deploymentLocalGitUrl \
			--output tsv)
		az webapp update \
			--resource-group $1 \
			--name $3 \
			--https-only true \
			--output none
		az webapp config set \
			--resource-group $1 \
			--name $3 \
			--min-tls-version 1.1 \
			--output none
		az webapp config set \
			--resource-group $1 \
			--name $3 \
			--always-on true \
			--output none
		configure_app_service $1 $3

		az webapp deployment slot create \
			--resource-group $1 \
			--name $3 \
			--slot "staging" \
			--output none
		az webapp update \
			--resource-group $1 \
			--name $3 \
			--slot "staging" \
			--https-only true \
			--output none
		az webapp config set \
			--resource-group $1 \
			--name $3 \
			--slot "staging" \
			--min-tls-version 1.1 \
			--output none
		az webapp config set \
			--resource-group $1 \
			--name $3 \
			--slot "staging" \
			--always-on true \
			--output none
		configure_app_service $1 $3 "staging"

		git remote rm azure 2>/dev/null
		git remote add azure ${git_repo}

		git remote rm azure-staging 2>/dev/null
		git remote add azure-staging "https://${DEPLOYMENT_USER}@$3-staging.scm.azurewebsites.net/$3.git"

		echo -e "app-service ${COLOR_GREEN}Ready!${NC}"
	else
		echo -e "${COLOR_GREEN}OK${NC}"
	fi
}

function configure_app_service {
	printf "  - configuring ${COLOR_GREEN}app settings${NC} for ${COLOR_GREEN}app-service${NC} ${COLOR_BLUE}$2${NC}... "

	az webapp config appsettings set \
		--resource-group $1 \
		--name $2 \
		$([[ -n $3 ]] && printf %s "--slot $3") \
		--settings \
			AZURE_STORAGE_ACCOUNT_ACCESS_KEY=$(eval echo "\$$(join_by '_' "AZURE_STORAGE_ACCOUNT_ACCESS_KEY" ${3^^})") \
			AZURE_STORAGE_ACCOUNT_NAME=$(eval echo "\$$(join_by '_' "AZURE_STORAGE_ACCOUNT_NAME" ${3^^})") \
			DATABASE_URL=$(eval echo "\$$(join_by '_' "DATABASE_URL" ${3^^})") \
			UPSTASH_REDIS_REST_URL=$(eval echo "\$$(join_by '_' "UPSTASH_REDIS_REST_URL" ${3^^})") \
			EMAILING_FROM=${EMAILING_FROM} \
			EMAIL_SERVER_HOST=${EMAIL_SERVER_HOST} \
			EMAIL_SERVER_PORT=${EMAIL_SERVER_PORT} \
			EMAIL_SERVER_USER=${EMAIL_SERVER_USER} \
			EMAIL_SERVER_PASS=$(eval echo "\$$(join_by '_' "EMAIL_SERVER_PASS" ${3^^})") \
			TEMPLATE_ORIGIN=${TEMPLATE_ORIGIN} \
			GOOGLE_ID=${GOOGLE_ID} \
			GOOGLE_SECRET=${GOOGLE_SECRET} \
			NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=${NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID} \
			OPENAI_API_KEY=${OPENAI_API_KEY} \
			GOOGLE_CLOUD_TRANSLATE_CREDENTIALS=${GOOGLE_CLOUD_TRANSLATE_CREDENTIALS} \
			GOOGLE_CLOUD_PROJECT_ID=${GOOGLE_CLOUD_PROJECT_ID} \
			NEXT_PUBLIC_MOSAIC_ITEMS_COUNT=${NEXT_PUBLIC_MOSAIC_ITEMS_COUNT} \
			NEXTAUTH_URL=$(eval echo "\$$(join_by '_' "NEXTAUTH_URL" ${3^^})") \
			NEXT_PUBLIC_AZURE_CDN_ENDPOINT=$(eval echo "\$$(join_by '_' "NEXT_PUBLIC_AZURE_CDN_ENDPOINT" ${3^^})") \
			NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME=${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME} \
			NEXT_PUBLIC_CLARITY_TRACKING_ID=${NEXT_PUBLIC_CLARITY_TRACKING_ID} \
			NEXT_PUBLIC_HYVOR_SSO_KEY=${NEXT_PUBLIC_HYVOR_SSO_KEY} \
			NEXT_PUBLIC_HYVOR_WEBSITE_ID=${NEXT_PUBLIC_HYVOR_WEBSITE_ID} \
			NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM=${NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM} \
			NEXT_PUBLIC_WEBAPP_URL=$(eval echo "\$$(join_by '_' "NEXT_PUBLIC_WEBAPP_URL" ${3^^})") \
			SECRET=${SECRET} \
		--output none
}

function deploy_app_service {
	printf "> update ${COLOR_YELLOW}app-service's${NC} ${COLOR_BLUE}ENV vars${NC}? [y/N]: "
	read INP
	if [[ $INP == 'y' || $INP == 'Y' ]]; then
		configure_app_service $1 $2 $3
	fi

	if [[ -z $3 ]]; then
		echo -e "Deploying ${COLOR_GREEN}git branch${NC} ${COLOR_BLUE}${GIT_BRANCH}${NC} to ${COLOR_GREEN}app-service${NC} ${COLOR_BLUE}$2${NC}..."
		git push -f azure ${GIT_BRANCH}:master
	else
		echo -e "Deploying ${COLOR_GREEN}git branch${NC} ${COLOR_BLUE}${GIT_BRANCH}${NC} to ${COLOR_GREEN}app-service${NC} ${COLOR_BLUE}$2${NC} (slot ${COLOR_YELLOW}$3${NC})..."
		git push -f azure-$3 ${GIT_BRANCH}:master
	fi

	echo "done"
}

function deploy_staging {
	check_app_service ${RESOURCE_GROUP_PRODUCTION} ${SERVICE_PLAN_NAME} ${APP_SERVICE_NAME} "${APP_SERVICE_RUNTIME}"
	deploy_app_service ${RESOURCE_GROUP_PRODUCTION} ${APP_SERVICE_NAME} "staging"
	echo -e "All deployment tasks ${COLOR_GREEN}completed successfully!${NC}"
}

function deploy_production {
	printf "Are you sure you want to deploy into ${COLOR_GREEN}production${NC}? [y/N]: "
	read INP
	if [[ ${INP} != 'y' && $INP != 'Y' ]]; then exit 1; fi

	check_app_service ${RESOURCE_GROUP_PRODUCTION} ${SERVICE_PLAN_NAME} ${APP_SERVICE_NAME} "${APP_SERVICE_RUNTIME}"
	deploy_app_service ${RESOURCE_GROUP_PRODUCTION} ${APP_SERVICE_NAME}
	echo -e "All deployment tasks ${COLOR_GREEN}completed successfully!${NC}"
}


echo -e "Eureka Azure deployment. Please select which target to deploy into:\n"
if [[ $GIT_BRANCH = $GIT_DEFAULT_BRANCH ]]; then default_target_idx=1; fi
select_option $default_target_idx "${deployment_targets[@]}"
selected_target_idx=$?

case ${deployment_targets[selected_target_idx]} in
	'staging')		deploy_staging;;
	'production')	deploy_production;;
	*)				exit 1;;
esac
