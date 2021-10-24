import useTranslation from 'next-translate/useTranslation';
import { useState /* , useEffect, ReactElement, Children */ } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import SimpleLayout from '../src/components/layouts/SimpleLayout'












function ManifestPage() {
    const { t } = useTranslation('common');
    const [show, setShow] = useState<string[]>(['gender-feminisms', 'technology', 'environment']);

    return (
        <SimpleLayout showHeader title={t('browserTitleWelcome')}>
            <Container>
                <Row>
                    <Col xs={12} md={4} className="d-flex flex-column">
                        <h1>{t('manifestLbl')}</h1>
                        <em>{t('eurekaPrinciple')}</em>
                    </Col>
                    <Col xs={12} md={4} className="">
                        <p><span>{t('welcomeEureka')}</span> {t('manifestDesc')}</p>
                    </Col>
                </Row>
            </Container>
        </SimpleLayout>
    );
}


export default ManifestPage;
