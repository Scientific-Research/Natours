import axios from 'axios';

const stripe = Stripe(
   'pk_test_51Ovd3zKtuNRIpwxYCGSANYvLULGAxPZAGW2y5um9EezQFXb7NaZQOV008heJ0BNFIdlu13zwBpCRxlS9F58cPCKd00BP6kIGuO'
);

export const bookTour = async (tourId) => {
   // 1) Get checkout session from API
   const session = await axios.get(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
   );
   console.log(session);

   // 2) Create checkout form + charge credit card
};
