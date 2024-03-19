import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
   'pk_test_51Ovd3zKtuNRIpwxYCGSANYvLULGAxPZAGW2y5um9EezQFXb7NaZQOV008heJ0BNFIdlu13zwBpCRxlS9F58cPCKd00BP6kIGuO'
);

export const bookTour = async (tourId) => {
   try {
      // 1) Get checkout session from API
      const session = await axios.get(
         // `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}` => in dev mode
         `/api/v1/bookings/checkout-session/${tourId}` // => in prod mode
      );
      // console.log(session);

      // 2) Create checkout form + charge credit card
      await stripe.redirectToCheckout({
         sessionId: session.data.session.id,
      });
   } catch (error) {
      console.log(error);
      showAlert('error', error);
   }
};
