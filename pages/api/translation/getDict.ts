import { LOCALES } from "@/src/constants";
import { readFile } from "fs";
import { defaultLocale } from "i18n";
import { Locale } from "i18n-config"
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
import { promisify } from "util";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const{locale:l,namespace:n}=req.body;
    const locale=l
        ? l.length>2 
            ? LOCALES[l] : l 
        : defaultLocale;

    const namespace=n?n.toString():'common';

    const path = join(process.cwd(),'locales',locale,`${namespace}.json`);
    const rf = promisify(readFile);
    const jsonStr = await rf(path);
    const json = JSON.parse(jsonStr.toString());
    return res.status(200).json(json);
}

