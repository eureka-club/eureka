import { CycleDetail } from "@/src/types/cycle";
import { Button } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

export const RenderGuidelines = ({cycle}:{cycle:CycleDetail}) => {
    const { t } = useTranslation('cycleDetail');
    const [gldView, setgldView] = useState<Record<string, boolean>>({});

    const toggleGuidelineDesc = (key: string) => {
        if (key in gldView) {
            setgldView((res) => {
            return { ...res, [`${key}`]: !res[key] };
            });
        } else setgldView((res) => ({ ...res, [`${key}`]: true }));
    };

    if (cycle?.guidelines) {
        const glc = Math.ceil(cycle.guidelines.length / 2);
        const gll = cycle.guidelines.slice(0, glc);
        const glr = cycle.guidelines.slice(glc);
        let IDX = 0;
        const renderLI = (g: { title: string; contentText: string | null }, idx: number, gl: string) => {
        const key = `${gl}!${g.title}${idx + 1}`;
        IDX += 1;
        return (
            <aside key={key} className="mb-3 bg-light">

            <h5 className="h6 fw-bold mb-0 ps-3 py-1 d-flex text-secondary">
                <span className="py-1 fw-bold">{`${IDX}. `}</span>
                <span className="py-1 fw-bold h6 mb-0 ps-3 d-flex">{`${g.title}`}</span>
                <Button 
                className="ms-auto text-white" 
                size="small" 
                onClick={() => toggleGuidelineDesc(key)}
                sx={{
                    backgroundColor:'var(--eureka-green)',
                    padding:'0',
                    ":hover":{
                    backgroundColor:'var(--color-primary-raised)',
                    }
                }}
                >
                {!gldView[key] ? <RiArrowDownSLine /> : <RiArrowUpSLine />}
                </Button>
            </h5>
            {gldView[key] && <p className="px-3 pt-0 pb-3">{g.contentText}</p>}
            </aside>
        );
        };

        return (
        <Row>
            {
            gll.length 
                ? <Col xs={12} md={6}>
                    <section className="">{gll.map((g, idx) => renderLI(g, idx, 'gll'))}</section>
                </Col>
                : <></>
            }
            {
                glr.length
                    ? <Col>
                        <section className="">{glr.map((g, idx) => renderLI(g, idx, 'glr'))}</section>
                    </Col>
                    : <></>
            }
        </Row>
        );
    }
    return <></>;
    }; 