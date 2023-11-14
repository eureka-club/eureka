import { useState, ChangeEvent, FormEvent } from 'react'; 
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { SelectChangeEvent, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Box } from '@mui/material';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import SignUpForm from '@/src/components/forms/SignUpForm';

interface FormValues {
  price: string;
  product: string;
  user: string,
  email: string,
  // language: string
}

const StripeCheckoutPage: NextPage = () => {
  const { t } = useTranslation('signUpForm');

  const [formValues, setFormValues] = useState<FormValues>({
    price: 'price_1OAtArHYKOHA4EIyjjEISJm7',
    product: 'prod_OyqslFUmYVAFWx',
    user: '',
    email: ''
    // language: '',
  });

  function handleChangeTextField(ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    ev.preventDefault();
   
   
    const { name, value } = ev.target;
    //console.log(name, value, 'name, value')
    setFormValues({
      ...formValues,
      [name]: value
    });
  }
  //const { t } = useTranslation('signUpForm');

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    console.log(formValues,'formValues')
    const res = await fetch('/api/stripe/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(formValues)
    })
    if(res.ok){
      const {stripe_session_url} = await res.json();
      window.location.href = stripe_session_url;
    }
  };


  return (
    <SimpleLayout title="Stripe checkout" showNavBar={true} showFooter={true}>
        <Box className="d-flex justify-content-center w-50" style={{paddingTop:'4rem'}}>
        <Form onSubmit={handleSubmit}>
          <TextField id="price" className="w-100 mb-4 " label="Price"
            variant="outlined" size="small" name="price"
            value={formValues.price!}
            type="text"
            onChange={handleChangeTextField}
          >
          </TextField>
          <TextField id="product" className=" w-100 mb-4" label="Product"
            variant="outlined" size="small" name="product"
            value={formValues.product!}
            type="text"
            onChange={handleChangeTextField}
          >
          </TextField>

          <TextField id="user" className="w-100 mb-4" label='User'
            variant="outlined" size="small" name="user"
            value={formValues.user!}
            type="text"
            onChange={handleChangeTextField}
          >
          </TextField>

          <TextField id="email" className="w-100 mb-5" label="Email"
            variant="outlined" size="small" name="email"
            value={formValues.email!}
            autoComplete="email"
            type="text"
            //helperText={`(${t('passRequirements')})`}
            onChange={handleChangeTextField}
          >
          </TextField>
            <Button type="submit" className={`mb-4 btn btn-eureka  w-100`}>
              Enviar a stripe
            </Button>

          </Form>

        </Box>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  // if (session != null) {
  //   return { redirect: { destination: '/', permanent: false } };
  // }

  return { props: {} };
};

export default StripeCheckoutPage;
