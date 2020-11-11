#!/usr/bin/env bash

__DIR__="$(cd "$(dirname "$BASH_SOURCE")" >/dev/null 2>&1 && pwd)"
source ${__DIR__}/_common.sh
source ${__DIR__}/../.env
source ${__DIR__}/../.env.local
source ${__DIR__}/.env

GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
GIT_REV=$(git rev-parse HEAD)


function check_app_service_plan {
	printf "Checking existence of ${COLOR_YELLOW}app-service plan${NC} ${COLOR_BLUE}$2${NC} in resource group ${COLOR_BLUE}$1${NC}... "
	res=$(az appservice plan show --resource-group $1 --name $2)
	if [[ -z ${res} ]]; then
		echo -e "${COLOR_RED}Missing!${NC}"
		exit 1
	fi
	echo -e "${COLOR_GREEN}OK${NC}"
}

function create_app_service {
	printf "Checking existence of ${COLOR_YELLOW}webapp${NC} ${COLOR_BLUE}$3${NC}... "
	az webapp show --resource-group $1 --name $3 --output none 2>/dev/null
	if [[ $? != 0 ]]; then
		echo -e "${COLOR_RED}Missing!${NC}"
		echo -e "Creating ${COLOR_YELLOW}webapp${NC} ${COLOR_BLUE}$3${NC} under app-service plan ${COLOR_BLUE}$2${NC}:"
			printf "  - setting-up ${COLOR_GREEN}deployment user${NC} ${COLOR_BLUE}${DEPLOYMENT_USER}${NC}... "
			az webapp deployment user set \
				--user-name ${DEPLOYMENT_USER} \
				--password "${DEPLOYMENT_PASSWORD}" \
				--output none
			echo "done"

			printf "  - creating ${COLOR_GREEN}webapp${NC} ${COLOR_BLUE}$3${NC}... "
			git_repo=$(az webapp create \
				--resource-group $1 \
				--plan $2 \
				--name $3 \
				--runtime "${APP_SERVICE_RUNTIME}" \
				--deployment-local-git \
				--query deploymentLocalGitUrl \
				--output tsv)
			echo "done"

			if [[ ${SERVICE_PLAN_SKU} != "F1" && ${SERVICE_PLAN_SKU} != "FREE" ]]; then
				printf "  - configuring ${COLOR_GREEN}always-on${NC} for webapp ${COLOR_BLUE}$3${NC}... "
				az webapp config set \
					--resource-group $1 \
					--name $3 \
					--always-on true \
					--output none
				echo "done"
			fi

			git remote rm azure 2>/dev/null
			git remote add azure ${git_repo}
		echo -e "Webapp ${COLOR_GREEN}Ready!${NC}"
	else
		echo -e "${COLOR_GREEN}OK${NC}"
	fi

	printf "Update ${COLOR_YELLOW}webapp's${NC} ${COLOR_BLUE}ENV vars${NC}? [y/N]: "
	read INP
	if [[ ${INP} == 'y' || $INP == 'Y' ]]; then
		printf "Configuring ${COLOR_GREEN}app settings${NC} for webapp ${COLOR_BLUE}$3${NC}... "
		az webapp config appsettings set \
			--resource-group $1 \
			--name $3 \
			--settings \
				NEXT_TELEMETRY_DISABLED=1 \
				DATABASE_ENGINE=${DATABASE_ENGINE} \
				DATABASE_URL=${DATABASE_URL} \
				NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL=${NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL} \
				LOCAL_ASSETS_HOST_DIR=${LOCAL_ASSETS_HOST_DIR} \
			--output none
		echo "done... waiting 15s"
		sleep 15
	fi

	echo -e "Deploying ${COLOR_YELLOW}sources${NC} with rev ${COLOR_GREEN}${GIT_REV}${NC} to webapp ${COLOR_BLUE}$3${NC}..."
	git push -f azure master

	printf "Updating ${COLOR_GREEN}GIT_REV${NC} for webapp ${COLOR_BLUE}$3${NC}... "
	az webapp config appsettings set \
		--resource-group $1 \
		--name $3 \
		--settings GIT_REV=${GIT_REV} \
		--output none
	echo "done"
}

check_app_service_plan ${RESOURCE_GROUP_APP} ${SERVICE_PLAN_NAME}
create_app_service ${RESOURCE_GROUP_APP} ${SERVICE_PLAN_NAME} ${APP_SERVICE_NAME}
echo -e "All deployment tasks ${COLOR_GREEN}completed successfully!${NC}"
