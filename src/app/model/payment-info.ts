export class PaymentInfo {

    //amount jako number a na be jako int => $12.34 konvertovat na 1234 (12.34*100) centů a ty poslat na Stripe API
  constructor(public amount?: number, public currency?: string, public receiptEmail?: string) {}
}
