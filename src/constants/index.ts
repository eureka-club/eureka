export const DATE_FORMAT_HUMANIC_ADVANCED = 'MMMM Do YYYY';
export const DATE_FORMAT_PROPS = 'YYYY-MM-DD';
export const DATE_FORMAT_ONLY_YEAR = 'YYYY';
export const DATE_FORMAT_SHORT = 'DD·MM·YY';
export const DATE_FORMAT_SHORT_MONTH_YEAR = 'MM/YYYY';
export const DATE_FORMAT_LARGE = 'DD/MM/YYYY'; //'ddd DD, MMMM YYYY';

export const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL;
export const CLARITY_TRACKING_ID = process.env.NEXT_PUBLIC_CLARITY_TRACKING_ID;
export const HYVOR_SSO_KEY = process.env.NEXT_PUBLIC_HYVOR_SSO_KEY;
export const HYVOR_WEBSITE_ID = process.env.NEXT_PUBLIC_HYVOR_WEBSITE_ID;
export const STORAGE_MECHANISM_AZURE = 'azure';
export const STORAGE_MECHANISM_LOCAL_FILES = 'local';
export const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL;

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
export const LOCALE_COOKIE_TTL = 60 * 60 * 24 * 90;
export const LANGUAGES : Record<string, string> = {
    es: "spanish",
    en: 'english',
    fr: 'french',
    pt: 'portuguese'
}
export const LOCALES : Record<string, string> = {
   "spanish": 'es',
   'english': 'en',
   'french': 'fr',
   'portuguese': 'pt'
}

export interface CountryType {
    code?: string;
    flag: string;
    label: string;
    phone: string;
    parentCode: "Oceania"|"Northern America"|"Latin America and the Caribbean"|"Asia"|"Europe"|"Sub-Saharan Africa";
  }
  
  // From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
  export const COUNTRIES: readonly CountryType[] = [
     {
        "parentCode":"Europe",
        "flag":"AD",
        "label":"Andorra",
        "code":"andorra",
        "phone":"376"
     },
     {
        "parentCode":"Asia",
        "flag":"AE",
        "label":"United Arab Emirates",
        "code":"united-arab-emirates",
        "phone":"971"
     },
     {
        "parentCode":"Asia",
        "flag":"AF",
        "label":"Afghanistan",
        "code":"afghanistan",
        "phone":"93"
     },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"AG",
        "label":"Antigua and Barbuda",
        "code":"antigua-and-barbuda",
        "phone":"1-268"
     },
     {
        "parentCode":"Europe",
        "flag":"AL",
        "label":"Albania",
        "code":"albania",
        "phone":"355"
     },
     {
        "parentCode":"Asia",
        "flag":"AM",
        "label":"Armenia",
        "code":"armenia",
        "phone":"374"
     },
     {
        "parentCode":"Sub-Saharan Africa",
        "flag":"AO",
        "label":"Angola",
        "code":"angola",
        "phone":"244"
     },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"AR",
        "label":"Argentina",
        "code":"argentina",
        "phone":"54"
     },
     {
        "parentCode":"Europe",
        "flag":"AT",
        "label":"Austria",
        "code":"Austria",
        "phone":"43"
     },
     {
        "parentCode":"Oceania",
        "flag":"AU",
        "label":"Australia",
        "code":"australia",
        "phone":"61",
     },
     {
        "parentCode":"Asia",
        "flag":"AZ",
        "label":"Azerbaijan",
        "code":"azerbaijan",
        "phone":"994"
     },
     {
        "parentCode":"Europe",
        "flag":"BA",
        "label":"Bosnia and Herzegovina",
        "code":"bosnia-herzegovina",
        "phone":"387"
     },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"BB",
        "label":"Barbados",
        "code":"barbados",
        "phone":"1-246"
     },
     {
        "parentCode":"Asia",
        "flag":"BD",
        "label":"Bangladesh",
        "code":"bangladesh",
        "phone":"880"
     },
     {
        "parentCode":"Europe",
        "flag":"BE",
        "label":"Belgium",
        "code":"belgium",
        "phone":"32"
     },
     {
        "parentCode":"Sub-Saharan Africa",
        "flag":"BF",
        "label":"Burkina Faso",
        "code":"burkina-faso",
        "phone":"226"
     },
     {
        "parentCode":"Europe",
        "flag":"BG",
        "label":"Bulgaria",
        "code":"bulgaria",
        "phone":"359"
     },
     {
        "parentCode":"Asia",
        "flag":"BH",
        "label":"Bahrain",
        "code":"bahrain",
        "phone":"973"
     },
     {
        "parentCode":"Sub-Saharan Africa",
        "flag":"BI",
        "label":"Burundi",
        "code":"burundi",
        "phone":"257"
     },
     {
        "parentCode":"Sub-Saharan Africa",
        "flag":"BJ",
        "label":"Benin",
        "code":"benin",
        "phone":"229"
     },
     {
        "parentCode":"Northern America",
        "flag":"BM",
        "label":"Bermuda",
        "code":"bermuda",
        "phone":"1-441"
     },
     {
        "parentCode":"Asia",
        "flag":"BN",
        "label":"Brunei Darussalam",
        "code":"brunei",
        "phone":"673"
     },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"BO",
        "label":"Bolivia",
        "code":"bolivia",
        "phone":"591"
     },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"BR",
        "label":"Brazil",
        "code":"brazil",
        "phone":"55"
     },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"BS",
        "label":"Bahamas",
        "code":"bahamas",
        "phone":"1-242"
     },
     {
        "parentCode":"Asia",
        "flag":"BT",
        "label":"Bhutan",
        "code":"bhutan",
        "phone":"975"
     },
     {
        "parentCode":"Sub-Saharan Africa",
        "flag":"BW",
        "label":"Botswana",
        "code":"botswana",
        "phone":"267"
     },
     {
        "parentCode":"Europe",
        "flag":"BY",
        "label":"Belarus",
        "code":"belarus",
        "phone":"375"
     },
     {
        "parentCode":"Europe",
        "flag":"CH",
        "label":"Switzerland",
        "code":"Switzerland",
        "phone":"41"
     },
     {
        "parentCode":"Europe",
        "flag":"CY",
        "label":"Cyprus",
        "code":"Cyprus",
        "phone":"357"
     },
     {
        "parentCode":"Europe",
        "flag":"CZ",
        "label":"Czech Republic",
        "code":"czech-republic",
        "phone":"420"
     },
     {
        "parentCode":"Europe",
        "flag":"DE",
        "label":"Germany",
        "code":"germany",
        "phone":"49",
     },
     {
        "parentCode":"Europe",
        "flag":"EE",
        "label":"Estonia",
        "code":"estonia",
        "phone":"372"
     },
     {
        "parentCode":"Europe",
        "flag":"DK",
        "label":"Denmark",
        "code":"denmark",
        "phone":"45"
     },
     {
        "parentCode":"Europe",
        "flag":"ES",
        "label":"Spain",
        "code":"spain",
        "phone":"34"
     },
     {
        "parentCode":"Europe",
        "flag":"FI",
        "label":"Finland",
        "code":"Finland",
        "phone":"358"
     },
     {
        "parentCode":"Europe",
        "flag":"FR",
        "label":"France",
        "code":"france",
        "phone":"33",
     },
     {
        "parentCode":"Europe",
        "flag":"GB",
        "label":"United Kingdom",
        "code":"united-kingdom",
        "phone":"44"
     },
     {
        "parentCode":"Europe",
        "flag":"GE",
        "label":"Georgia",
        "code":"Georgia",
        "phone":"995"
     },
     {
        "parentCode":"Europe",
        "flag":"GR",
        "label":"Greece",
        "code":"Greece",
        "phone":"30"
     },
     {
        "parentCode":"Europe",
        "flag":"HR",
        "label":"Croatia",
        "code":"Croatia",
        "phone":"385"
     },
     {
        "parentCode":"Europe",
        "flag":"HU",
        "label":"Hungary",
        "code":"hungary",
        "phone":"36"
     },
     {
        "parentCode":"Europe",
        "flag":"IE",
        "label":"Ireland",
        "code":"ireland",
        "phone":"353"
     },
     {
        "parentCode":"Europe",
        "flag":"IS",
        "label":"Iceland",
        "code":"Iceland",
        "phone":"354"
     },
     {
        "parentCode":"Europe",
        "flag":"IT",
        "label":"Italy",
        "code":"italy",
        "phone":"39"
     },
     {
        "parentCode":"Europe",
        "flag":"LT",
        "label":"Lithuania",
        "code":"Lithuania",
        "phone":"370"
     },
     {
        "parentCode":"Europe",
        "flag":"LU",
        "label":"Luxembourg",
        "code":"Luxembourg",
        "phone":"352"
     },
     {
        "parentCode":"Europe",
        "flag":"LV",
        "label":"Latvia",
        "code":"Latvia",
        "phone":"371"
     },
     {
        "parentCode":"Europe",
        "flag":"MC",
        "label":"Monaco",
        "code":"Monaco",
        "phone":"377"
     },
     {
        "parentCode":"Europe",
        "flag":"MD",
        "label":"Moldova, Republic of",
        "code":"Moldova, Republic of",
        "phone":"373"
     },
     {
        "parentCode":"Europe",
        "flag":"ME",
        "label":"Montenegro",
        "code":"Montenegro",
        "phone":"382"
     },
     {
        "parentCode":"Europe",
        "flag":"MK",
        "label":"Republic of North Macedonia",
        "code":"republic-of-north-macedonia",
        "phone":"389"
     },
     {
        "parentCode":"Europe",
        "flag":"NL",
        "label":"Netherlands",
        "code":"netherlands",
        "phone":"31"
     },
     {
        "parentCode":"Europe",
        "flag":"NO",
        "label":"Norway",
        "code":"norway",
        "phone":"47"
     },
     {
        "parentCode":"Europe",
        "flag":"PL",
        "label":"Poland",
        "code":"poland",
        "phone":"48"
     },
     {
        "parentCode":"Europe",
        "flag":"PT",
        "label":"Portugal",
        "code":"Portugal",
        "phone":"351"
     },
     {
        "parentCode":"Europe",
        "flag":"RO",
        "label":"Romania",
        "code":"romania",
        "phone":"40"
     },
     {
        "parentCode":"Europe",
        "flag":"RS",
        "label":"Serbia",
        "code":"Serbia",
        "phone":"381"
     },
     {
        "parentCode":"Asia",
        "flag":"RU",
        "label":"Russian Federation",
        "code":"russian",
        "phone":"7"
     },
     {
        "parentCode":"Northern America",
        "flag":"CA",
        "label":"Canada",
        "code":"canada",
        "phone":"1",
     },
     // {
     //    "flag":"BZ",
     //    "label":"Belize",
     //    "code":"Belize",
     //    "phone":"501"
     // },
     // {
     //    "flag":"CC",
     //    "label":"Cocos (Keeling) Islands",
     //    "code":"Cocos (Keeling) Islands",
     //    "phone":"61"
     // },
     // {
     //    "flag":"CD",
     //    "label":"Congo, Democratic Republic of the",
     //    "code":"Congo, Democratic Republic of the",
     //    "phone":"243"
     // },
     // {
     //    "flag":"CF",
     //    "label":"Central African Republic",
     //    "code":"Central African Republic",
     //    "phone":"236"
     // },
     // {
     //    "flag":"CG",
     //    "label":"Congo, Republic of the",
     //    "code":"Congo, Republic of the",
     //    "phone":"242"
     // },
     
     // {
     //    "flag":"CI",
     //    "label":"Cote d'Ivoire",
     //    "code":"Cote d'Ivoire",
     //    "phone":"225"
     // },
     {
        "parentCode":"Asia",
        "flag":"KR",
        "label":"South Korea",
        "code":"south-korea",
        "phone":"82"
     },
     {
        "parentCode":"Asia",
        "flag":"KP",
        "label":"North Korea",
        "code":"north-korea",
        "phone":"850"
     },
     
  
     // {
     //    "flag":"CK",
     //    "label":"Cook Islands",
     //    "code":"Cook Islands",
     //    "phone":"682"
     // },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"CL",
        "label":"Chile",
        "code":"chile",
        "phone":"56"
     },
     // {
     //    "flag":"CM",
     //    "label":"Cameroon",
     //    "code":"Cameroon",
     //    "phone":"237"
     // },
     {
        "parentCode":"Asia",
        "flag":"CN",
        "label":"China",
        "code":"china",
        "phone":"86"
     },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"CO",
        "label":"Colombia",
        "code":"colombia",
        "phone":"57"
     },
     // {
     //    "flag":"CR",
     //    "label":"Costa Rica",
     //    "code":"Costa Rica",
     //    "phone":"506"
     // },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"CU",
        "label":"Cuba",
        "code":"cuba",
        "phone":"53"
     },
     // {
     //    "flag":"CV",
     //    "label":"Cape Verde",
     //    "code":"Cape Verde",
     //    "phone":"238"
     // },
     // {
     //    "flag":"CW",
     //    "label":"Curacao",
     //    "code":"Curacao",
     //    "phone":"599"
     // },
     // {
     //    "flag":"CX",
     //    "label":"Christmas Island",
     //    "code":"Christmas Island",
     //    "phone":"61"
     // },
     // {
     //    "flag":"DJ",
     //    "label":"Djibouti",
     //    "code":"Djibouti",
     //    "phone":"253"
     // },
     // {
     //    "flag":"DM",
     //    "label":"Dominica",
     //    "code":"Dominica",
     //    "phone":"1-767"
     // },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"DO",
        "label":"Dominican Republic",
        "code":"dominican-republic",
        "phone":"1-809"
     },
     {
        "parentCode":"Sub-Saharan Africa",
        "flag":"DZ",
        "label":"Algeria",
        "code":"algeria",
        "phone":"213"
     },
     // {
     //    "flag":"EC",
     //    "label":"Ecuador",
     //    "code":"Ecuador",
     //    "phone":"593"
     // },
     // {
     //    "flag":"EG",
     //    "label":"Egypt",
     //    "code":"Egypt",
     //    "phone":"20"
     // },
     // {
     //    "flag":"EH",
     //    "label":"Western Sahara",
     //    "code":"Western Sahara",
     //    "phone":"212"
     // },
     // {
     //    "flag":"ER",
     //    "label":"Eritrea",
     //    "code":"Eritrea",
     //    "phone":"291"
     // },
     
     // {
     //    "flag":"ET",
     //    "label":"Ethiopia",
     //    "code":"Ethiopia",
     //    "phone":"251"
     // },
     // {
     //    "flag":"FJ",
     //    "label":"Fiji",
     //    "code":"Fiji",
     //    "phone":"679"
     // },
     // {
     //    "flag":"FK",
     //    "label":"Falkland Islands (Malvinas)",
     //    "code":"Falkland Islands (Malvinas)",
     //    "phone":"500"
     // },
     // {
     //    "flag":"FM",
     //    "label":"Micronesia, Federated States of",
     //    "code":"Micronesia, Federated States of",
     //    "phone":"691"
     // },
     // {
     //    "flag":"FO",
     //    "label":"Faroe Islands",
     //    "code":"Faroe Islands",
     //    "phone":"298"
     // },
     // {
     //    "flag":"GA",
     //    "label":"Gabon",
     //    "code":"Gabon",
     //    "phone":"241"
     // },
     // {
     //    "flag":"GD",
     //    "label":"Grenada",
     //    "code":"Grenada",
     //    "phone":"1-473"
     // },
     // {
     //    "flag":"GF",
     //    "label":"French Guiana",
     //    "code":"French Guiana",
     //    "phone":"594"
     // },
     // {
     //    "flag":"GG",
     //    "label":"Guernsey",
     //    "code":"Guernsey",
     //    "phone":"44"
     // },
     {
        "parentCode":"Sub-Saharan Africa",
        "flag":"GH",
        "label":"Ghana",
        "code":"ghana",
        "phone":"233"
     },
     // {
     //    "flag":"GI",
     //    "label":"Gibraltar",
     //    "code":"Gibraltar",
     //    "phone":"350"
     // },
     // {
     //    "flag":"GL",
     //    "label":"Greenland",
     //    "code":"Greenland",
     //    "phone":"299"
     // },
     // {
     //    "flag":"GM",
     //    "label":"Gambia",
     //    "code":"Gambia",
     //    "phone":"220"
     // },
     // {
     //    "flag":"GN",
     //    "label":"Guinea",
     //    "code":"Guinea",
     //    "phone":"224"
     // },
     // {
     //    "flag":"GP",
     //    "label":"Guadeloupe",
     //    "code":"Guadeloupe",
     //    "phone":"590"
     // },
     // {
     //    "flag":"GQ",
     //    "label":"Equatorial Guinea",
     //    "code":"Equatorial Guinea",
     //    "phone":"240"
     // },
     // {
     //    "flag":"GS",
     //    "label":"South Georgia and the South Sandwich Islands",
     //    "code":"South Georgia and the South Sandwich Islands",
     //    "phone":"500"
     // },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"GT",
        "label":"Guatemala",
        "code":"guatemala",
        "phone":"502"
     },
     // {
     //    "flag":"GU",
     //    "label":"Guam",
     //    "code":"Guam",
     //    "phone":"1-671"
     // },
     // {
     //    "flag":"GW",
     //    "label":"Guinea-Bissau",
     //    "code":"Guinea-Bissau",
     //    "phone":"245"
     // },
     // {
     //    "flag":"GY",
     //    "label":"Guyana",
     //    "code":"Guyana",
     //    "phone":"592"
     // },
     // {
     //    "flag":"HK",
     //    "label":"Hong Kong",
     //    "code":"Hong Kong",
     //    "phone":"852"
     // },
     // {
     //    "flag":"HM",
     //    "label":"Heard Island and McDonald Islands",
     //    "code":"Heard Island and McDonald Islands",
     //    "phone":"672"
     // },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"HN",
        "label":"Honduras",
        "code":"honduras",
        "phone":"504"
     },
     // {
     //    "flag":"HT",
     //    "label":"Haiti",
     //    "code":"Haiti",
     //    "phone":"509"
     // },
     // {
     //    "flag":"ID",
     //    "label":"Indonesia",
     //    "code":"Indonesia",
     //    "phone":"62"
     // },
     {
        "parentCode":"Asia",
        "flag":"IL",
        "label":"Israel",
        "code":"israel",
        "phone":"972"
     },
     // {
     //    "flag":"IM",
     //    "label":"Isle of Man",
     //    "code":"Isle of Man",
     //    "phone":"44"
     // },
     // {
     //    "flag":"IN",
     //    "label":"India",
     //    "code":"India",
     //    "phone":"91"
     // },
     // {
     //    "flag":"IO",
     //    "label":"British Indian Ocean Territory",
     //    "code":"British Indian Ocean Territory",
     //    "phone":"246"
     // },
     // {
     //    "flag":"IQ",
     //    "label":"Iraq",
     //    "code":"Iraq",
     //    "phone":"964"
     // },
     {
        "parentCode":"Asia",
        "flag":"IR",
        "label":"Iran, Islamic Republic of",
        "code":"iran",
        "phone":"98"
     },
     // {
     //    "flag":"JE",
     //    "label":"Jersey",
     //    "code":"Jersey",
     //    "phone":"44"
     // },
     // {
     //    "flag":"JM",
     //    "label":"Jamaica",
     //    "code":"Jamaica",
     //    "phone":"1-876"
     // },
     // {
     //    "flag":"JO",
     //    "label":"Jordan",
     //    "code":"Jordan",
     //    "phone":"962"
     // },
     {
        "parentCode":"Asia",
        "flag":"JP",
        "label":"Japan",
        "code":"japan",
        "phone":"81",
     },
     {
        "parentCode":"Europe",
        "flag":"SE",
        "label":"Sweden",
        "code":"sweden",
        "phone":"+46",
     },
     // {
     //    "flag":"KE",
     //    "label":"Kenya",
     //    "code":"Kenya",
     //    "phone":"254"
     // },
     // {
     //    "flag":"KG",
     //    "label":"Kyrgyzstan",
     //    "code":"Kyrgyzstan",
     //    "phone":"996"
     // },
     {
        "parentCode":"Asia",
        "flag":"KH",
        "label":"Cambodia",
        "code":"cambodia",
        "phone":"855"
     },
     // {
     //    "flag":"KI",
     //    "label":"Kiribati",
     //    "code":"Kiribati",
     //    "phone":"686"
     // },
     // {
     //    "flag":"KM",
     //    "label":"Comoros",
     //    "code":"Comoros",
     //    "phone":"269"
     // },
     // {
     //    "flag":"KN",
     //    "label":"Saint Kitts and Nevis",
     //    "code":"Saint Kitts and Nevis",
     //    "phone":"1-869"
     // },
     
     // {
     //    "flag":"KW",
     //    "label":"Kuwait",
     //    "code":"Kuwait",
     //    "phone":"965"
     // },
     // {
     //    "flag":"KY",
     //    "label":"Cayman Islands",
     //    "code":"Cayman Islands",
     //    "phone":"1-345"
     // },
     // {
     //    "flag":"KZ",
     //    "label":"Kazakhstan",
     //    "code":"Kazakhstan",
     //    "phone":"7"
     // },
     // {
     //    "flag":"LA",
     //    "label":"Lao People's Democratic Republic",
     //    "code":"Lao People's Democratic Republic",
     //    "phone":"856"
     // },
     {
        "parentCode":"Asia",
        "flag":"LB",
        "label":"Lebanon",
        "code":"lebanon",
        "phone":"961"
     },
     // {
     //    "flag":"LC",
     //    "label":"Saint Lucia",
     //    "code":"Saint Lucia",
     //    "phone":"1-758"
     // },
     // {
     //    "flag":"LI",
     //    "label":"Liechtenstein",
     //    "code":"Liechtenstein",
     //    "phone":"423"
     // },
     // {
     //    "flag":"LK",
     //    "label":"Sri Lanka",
     //    "code":"Sri Lanka",
     //    "phone":"94"
     // },
     // {
     //    "flag":"LR",
     //    "label":"Liberia",
     //    "code":"Liberia",
     //    "phone":"231"
     // },
     // {
     //    "flag":"LS",
     //    "label":"Lesotho",
     //    "code":"Lesotho",
     //    "phone":"266"
     // },
     // {
     //    "flag":"LY",
     //    "label":"Libya",
     //    "code":"Libya",
     //    "phone":"218"
     // },
     // {
     //    "flag":"MA",
     //    "label":"Morocco",
     //    "code":"Morocco",
     //    "phone":"212"
     // },
     // {
     //    "flag":"MF",
     //    "label":"Saint Martin (French part)",
     //    "code":"Saint Martin (French part)",
     //    "phone":"590"
     // },
     // {
     //    "flag":"MG",
     //    "label":"Madagascar",
     //    "code":"Madagascar",
     //    "phone":"261"
     // },
     // {
     //    "flag":"MH",
     //    "label":"Marshall Islands",
     //    "code":"Marshall Islands",
     //    "phone":"692"
     // },
     
     // {
     //    "flag":"ML",
     //    "label":"Mali",
     //    "code":"Mali",
     //    "phone":"223"
     // },
     // {
     //    "flag":"MM",
     //    "label":"Myanmar",
     //    "code":"Myanmar",
     //    "phone":"95"
     // },
     // {
     //    "flag":"MN",
     //    "label":"Mongolia",
     //    "code":"Mongolia",
     //    "phone":"976"
     // },
     // {
     //    "flag":"MO",
     //    "label":"Macao",
     //    "code":"Macao",
     //    "phone":"853"
     // },
     // {
     //    "flag":"MP",
     //    "label":"Northern Mariana Islands",
     //    "code":"Northern Mariana Islands",
     //    "phone":"1-670"
     // },
     // {
     //    "flag":"MQ",
     //    "label":"Martinique",
     //    "code":"Martinique",
     //    "phone":"596"
     // },
     // {
     //    "flag":"MR",
     //    "label":"Mauritania",
     //    "code":"Mauritania",
     //    "phone":"222"
     // },
     // {
     //    "flag":"MS",
     //    "label":"Montserrat",
     //    "code":"Montserrat",
     //    "phone":"1-664"
     // },
     // {
     //    "flag":"MT",
     //    "label":"Malta",
     //    "code":"Malta",
     //    "phone":"356"
     // },
     // {
     //    "flag":"MU",
     //    "label":"Mauritius",
     //    "code":"Mauritius",
     //    "phone":"230"
     // },
     // {
     //    "flag":"MV",
     //    "label":"Maldives",
     //    "code":"Maldives",
     //    "phone":"960"
     // },
     // {
     //    "flag":"MW",
     //    "label":"Malawi",
     //    "code":"Malawi",
     //    "phone":"265"
     // },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"MX",
        "label":"Mexico",
        "code":"mexico",
        "phone":"52"
     },
     // {
     //    "flag":"MY",
     //    "label":"Malaysia",
     //    "code":"Malaysia",
     //    "phone":"60"
     // },
     // {
     //    "flag":"MZ",
     //    "label":"Mozambique",
     //    "code":"Mozambique",
     //    "phone":"258"
     // },
     // {
     //    "flag":"NA",
     //    "label":"Namibia",
     //    "code":"Namibia",
     //    "phone":"264"
     // },
     // {
     //    "flag":"NC",
     //    "label":"New Caledonia",
     //    "code":"New Caledonia",
     //    "phone":"687"
     // },
     // {
     //    "flag":"NE",
     //    "label":"Niger",
     //    "code":"Niger",
     //    "phone":"227"
     // },
     // {
     //    "flag":"NF",
     //    "label":"Norfolk Island",
     //    "code":"Norfolk Island",
     //    "phone":"672"
     // },
     {
        "parentCode":"Sub-Saharan Africa",
        "flag":"NG",
        "label":"Nigeria",
        "code":"nigeria",
        "phone":"234"
     },
     // {
     //    "flag":"NI",
     //    "label":"Nicaragua",
     //    "code":"Nicaragua",
     //    "phone":"505"
     // },
     // {
     //    "flag":"NP",
     //    "label":"Nepal",
     //    "code":"Nepal",
     //    "phone":"977"
     // },
     // {
     //    "flag":"NR",
     //    "label":"Nauru",
     //    "code":"Nauru",
     //    "phone":"674"
     // },
     // {
     //    "flag":"NU",
     //    "label":"Niue",
     //    "code":"Niue",
     //    "phone":"683"
     // },
     {
        "parentCode":"Oceania",
        "flag":"NZ",
        "label":"New Zealand",
        "code":"new-zealand",
        "phone":"64"
     },
     // {
     //    "flag":"OM",
     //    "label":"Oman",
     //    "code":"Oman",
     //    "phone":"968"
     // },
     // {
     //    "flag":"PA",
     //    "label":"Panama",
     //    "code":"Panama",
     //    "phone":"507"
     // },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"PE",
        "label":"Peru",
        "code":"peru",
        "phone":"51"
     },
     // {
     //    "flag":"PF",
     //    "label":"French Polynesia",
     //    "code":"French Polynesia",
     //    "phone":"689"
     // },
     // {
     //    "flag":"PG",
     //    "label":"Papua New Guinea",
     //    "code":"Papua New Guinea",
     //    "phone":"675"
     // },
     // {
     //    "flag":"PH",
     //    "label":"Philippines",
     //    "code":"Philippines",
     //    "phone":"63"
     // },
     {
        "parentCode":"Asia",
        "flag":"PK",
        "label":"Pakistan",
        "code":"pakistan",
        "phone":"92"
     },
     // {
     //    "flag":"PM",
     //    "label":"Saint Pierre and Miquelon",
     //    "code":"Saint Pierre and Miquelon",
     //    "phone":"508"
     // },
     // {
     //    "flag":"PN",
     //    "label":"Pitcairn",
     //    "code":"Pitcairn",
     //    "phone":"870"
     // },
     // {
     //    "flag":"PR",
     //    "label":"Puerto Rico",
     //    "code":"Puerto Rico",
     //    "phone":"1"
     // },
     // {
     //    "flag":"PS",
     //    "label":"Palestine, State of",
     //    "code":"Palestine, State of",
     //    "phone":"970"
     // },
     // {
     //    "flag":"PW",
     //    "label":"Palau",
     //    "code":"Palau",
     //    "phone":"680"
     // },
     // {
     //    "flag":"PY",
     //    "label":"Paraguay",
     //    "code":"Paraguay",
     //    "phone":"595"
     // },
     // {
     //    "flag":"QA",
     //    "label":"Qatar",
     //    "code":"Qatar",
     //    "phone":"974"
     // },
     // {
     //    "flag":"RE",
     //    "label":"Reunion",
     //    "code":"Reunion",
     //    "phone":"262"
     // },
     // {
     //    "flag":"RW",
     //    "label":"Rwanda",
     //    "code":"Rwanda",
     //    "phone":"250"
     // },
     // {
     //    "flag":"SA",
     //    "label":"Saudi Arabia",
     //    "code":"Saudi Arabia",
     //    "phone":"966"
     // },
     // {
     //    "flag":"SB",
     //    "label":"Solomon Islands",
     //    "code":"Solomon Islands",
     //    "phone":"677"
     // },
     // {
     //    "flag":"SC",
     //    "label":"Seychelles",
     //    "code":"Seychelles",
     //    "phone":"248"
     // },
     // {
     //    "flag":"SD",
     //    "label":"Sudan",
     //    "code":"Sudan",
     //    "phone":"249"
     // },
     // {
     //    "flag":"SG",
     //    "label":"Singapore",
     //    "code":"Singapore",
     //    "phone":"65"
     // },
     // {
     //    "flag":"SH",
     //    "label":"Saint Helena",
     //    "code":"Saint Helena",
     //    "phone":"290"
     // },
     // {
     //    "flag":"SJ",
     //    "label":"Svalbard and Jan Mayen",
     //    "code":"Svalbard and Jan Mayen",
     //    "phone":"47"
     // },
     {
        "parentCode":"Sub-Saharan Africa",
        "flag":"SL",
        "label":"Sierra Leone",
        "code":"sierra-leone",
        "phone":"232"
     },
     // {
     //    "flag":"SN",
     //    "label":"Senegal",
     //    "code":"Senegal",
     //    "phone":"221"
     // },
     // {
     //    "flag":"SO",
     //    "label":"Somalia",
     //    "code":"Somalia",
     //    "phone":"252"
     // },
     // {
     //    "flag":"SR",
     //    "label":"Suriname",
     //    "code":"Suriname",
     //    "phone":"597"
     // },
     {
        "parentCode":"Sub-Saharan Africa",
        "flag":"SS",
        "label":"South Sudan",
        "code":"sudan",
        "phone":"211"
     },
     // {
     //    "flag":"ST",
     //    "label":"Sao Tome and Principe",
     //    "code":"Sao Tome and Principe",
     //    "phone":"239"
     // },
     // {
     //    "flag":"SV",
     //    "label":"El Salvador",
     //    "code":"El Salvador",
     //    "phone":"503"
     // },
     // {
     //    "flag":"SX",
     //    "label":"Sint Maarten (Dutch part)",
     //    "code":"Sint Maarten (Dutch part)",
     //    "phone":"1-721"
     // },
     // {
     //    "flag":"SY",
     //    "label":"Syrian Arab Republic",
     //    "code":"Syrian Arab Republic",
     //    "phone":"963"
     // },
     // {
     //    "flag":"SZ",
     //    "label":"Swaziland",
     //    "code":"Swaziland",
     //    "phone":"268"
     // },
     // {
     //    "flag":"TC",
     //    "label":"Turks and Caicos Islands",
     //    "code":"Turks and Caicos Islands",
     //    "phone":"1-649"
     // },
     // {
     //    "flag":"TD",
     //    "label":"Chad",
     //    "code":"Chad",
     //    "phone":"235"
     // },
     // {
     //    "flag":"TF",
     //    "label":"French Southern Territories",
     //    "code":"French Southern Territories",
     //    "phone":"262"
     // },
     // {
     //    "flag":"TG",
     //    "label":"Togo",
     //    "code":"Togo",
     //    "phone":"228"
     // },
     // {
     //    "flag":"TH",
     //    "label":"Thailand",
     //    "code":"Thailand",
     //    "phone":"66"
     // },
     // {
     //    "flag":"TJ",
     //    "label":"Tajikistan",
     //    "code":"Tajikistan",
     //    "phone":"992"
     // },
     // {
     //    "flag":"TK",
     //    "label":"Tokelau",
     //    "code":"Tokelau",
     //    "phone":"690"
     // },
     // {
     //    "flag":"TL",
     //    "label":"Timor-Leste",
     //    "code":"Timor-Leste",
     //    "phone":"670"
     // },
     // {
     //    "flag":"TM",
     //    "label":"Turkmenistan",
     //    "code":"Turkmenistan",
     //    "phone":"993"
     // },
     // {
     //    "flag":"TN",
     //    "label":"Tunisia",
     //    "code":"Tunisia",
     //    "phone":"216"
     // },
     // {
     //    "flag":"TO",
     //    "label":"Tonga",
     //    "code":"Tonga",
     //    "phone":"676"
     // },
     // {
     //    "flag":"TR",
     //    "label":"Turkey",
     //    "code":"Turkey",
     //    "phone":"90"
     // },
     // {
     //    "flag":"TT",
     //    "label":"Trinidad and Tobago",
     //    "code":"Trinidad and Tobago",
     //    "phone":"1-868"
     // },
     // {
     //    "flag":"TV",
     //    "label":"Tuvalu",
     //    "code":"Tuvalu",
     //    "phone":"688"
     // },
     {
        "parentCode":"Asia",
        "flag":"TW",
        "label":"Taiwan, Republic of China",
        "code":"taiwan-republic-of-china",
        "phone":"886"
     },
     // {
     //    "flag":"TZ",
     //    "label":"United Republic of Tanzania",
     //    "code":"United Republic of Tanzania",
     //    "phone":"255"
     // },
     {
        "parentCode":"Sub-Saharan Africa",
        "flag":"UG",
        "label":"Uganda",
        "code":"uganda",
        "phone":"256"
     },
     {
        "parentCode":"Northern America",
        "flag":"US",
        "label":"United States",
        "code":"united-states",
        "phone":"1",
     },
     {
        "parentCode":"Latin America and the Caribbean",
        "flag":"UY",
        "label":"Uruguay",
        "code":"uruguay",
        "phone":"598"
     },
     // {
     //    "flag":"UZ",
     //    "label":"Uzbekistan",
     //    "code":"Uzbekistan",
     //    "phone":"998"
     // },
     // {
     //    "flag":"VA",
     //    "label":"Holy See (Vatican City State)",
     //    "code":"Holy See (Vatican City State)",
     //    "phone":"379"
     // },
     // {
     //    "flag":"VC",
     //    "label":"Saint Vincent and the Grenadines",
     //    "code":"Saint Vincent and the Grenadines",
     //    "phone":"1-784"
     // },
     // {
     //    "flag":"VE",
     //    "label":"Venezuela",
     //    "code":"Venezuela",
     //    "phone":"58"
     // },
     // {
     //    "flag":"VG",
     //    "label":"British Virgin Islands",
     //    "code":"British Virgin Islands",
     //    "phone":"1-284"
     // },
     // {
     //    "flag":"VI",
     //    "label":"US Virgin Islands",
     //    "code":"US Virgin Islands",
     //    "phone":"1-340"
     // },
     // {
     //    "flag":"VN",
     //    "label":"Vietnam",
     //    "code":"Vietnam",
     //    "phone":"84"
     // },
     // {
     //    "flag":"VU",
     //    "label":"Vanuatu",
     //    "code":"Vanuatu",
     //    "phone":"678"
     // },
     // {
     //    "flag":"WF",
     //    "label":"Wallis and Futuna",
     //    "code":"Wallis and Futuna",
     //    "phone":"681"
     // },
     // {
     //    "flag":"WS",
     //    "label":"Samoa",
     //    "code":"Samoa",
     //    "phone":"685"
     // },
     // {
     //    "flag":"XK",
     //    "label":"Kosovo",
     //    "code":"Kosovo",
     //    "phone":"383"
     // },
     // {
     //    "flag":"YE",
     //    "label":"Yemen",
     //    "code":"Yemen",
     //    "phone":"967"
     // },
     // {
     //    "flag":"YT",
     //    "label":"Mayotte",
     //    "code":"Mayotte",
     //    "phone":"262"
     // },
     {
        "parentCode":"Sub-Saharan Africa",
        "flag":"ZA",
        "label":"South Africa",
        "code":"south-africa",
        "phone":"27"
     },
     // {
     //    "flag":"ZM",
     //    "label":"Zambia",
     //    "code":"Zambia",
     //    "phone":"260"
     // },
     // {
     //    "flag":"ZW",
     //    "label":"Zimbabwe",
     //    "code":"Zimbabwe",
     //    "phone":"263"
     // }
   ];
  