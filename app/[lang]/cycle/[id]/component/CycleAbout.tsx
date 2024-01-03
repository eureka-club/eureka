"use client"

import styles from './CycleAbout.module.css';

import { t } from "@/src/get-dictionary";
import useCycle from "@/src/hooks/useCycle";
import { useDictContext } from "@/src/hooks/useDictContext";
import { MosaicContext } from "@/src/hooks/useMosaicContext";
import { Box, Grid } from "@mui/material";
import { useParams } from "next/navigation";
import { FC } from "react";
import CycleDetailWorks from "./CycleDetailWorks";
import useCycleWorksDates from "@/src/hooks/useCycleWorksDates";
import dayjs from "dayjs";
import { ASSETS_BASE_URL, DATE_FORMAT_SHORT_MONTH_YEAR } from "@/src/constants";

const CycleAbout:FC =  ()=>{
    const {id}=useParams();
    const {dict}=useDictContext();
    const {data:cycle}=useCycle(+id);
    return <section>
        <h3 className="h5 mt-4 mb-3 fw-bold text-gray-dark">{t(dict,'Why does this cycle matter')}?</h3>
                        {cycle?.contentText != null && (
                          <Box className="">
                            <Box
                              dangerouslySetInnerHTML={{ __html: cycle.contentText }}
                            />
                            {/* <UnclampText text={cycle.contentText} clampHeight="7rem" /> */}
                          </Box>
                        )}
                        <Box>
                          <MosaicContext.Provider value={{ showShare: true }}>                     
                            <CycleDetailWorks />
                          </MosaicContext.Provider>
                        </Box>
                        {cycle?.complementaryMaterials && cycle?.complementaryMaterials.length > 0 && (
                          <Grid container className="mt-5 mb-5">
                            <Grid item className='col-12'>
                              <h4 className="h5 mt-5 mb-3 fw-bold text-gray-dark">{t(dict,'complementaryMaterialsTitle')}</h4>
                              <ul className={styles.complementaryMaterials}>
                                {cycle.complementaryMaterials.map((cm) => (
                                  <li key={cm.id}>
                                    <a
                                      href={cm.link || `${ASSETS_BASE_URL}/${cm.storedFile}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <h5>{cm.title}</h5>
                                      <p>
                                        {cm.author} ({dayjs(cm.publicationDate).format(DATE_FORMAT_SHORT_MONTH_YEAR)})
                                      </p>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </Grid>
                            <Grid />
                          </Grid>
                        )}
                        {/* language=CSS */}
        <style jsx global>
                {`
                    #btn-about{
                        color:white!important;
                        background-color:var(--eureka-green)!important;
                        padding-left:1rem;
                        padding-right:1rem;
                        border-bottom:none;
                        border-radius: 4px 4px 0 0;
                    }
                `}
                </style>
    </section>
}
export default CycleAbout;