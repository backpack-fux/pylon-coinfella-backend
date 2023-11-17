export const chargeMessages = {
  "10000": "The request was successful.",
  "20000":
    "The request was declined, though subsequent attempts may be successful.",
  "30000":
    "The request was declined. Most hard declines require the issuer or cardholder to rectify the outstanding issue(s) before a subsequent attempt can be made.",
  "40000": "The request triggered a risk response.",
  "20001":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Refer to card issuer / Contact card issuer)",
  "20002":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Refer to card issuer - Special conditions)",
  "20003":
    "The payment failed due to a technical issue. If the issue persists please contact us. (Invalid merchant or service provider)",
  "20005":
    "The payment has been declined by your bank. Please try a different card. (Declined - Do not honour)",
  "20006": "Error / Invalid request parameters",
  "20009": "Request in progress",
  "20010": "Partial value approved",
  "20012":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Invalid transaction)",
  "20013":
    "The payment failed due to a technical issue. If the issue persists please contact us. (Invalid value/amount)",
  "20014":
    "The payment failed, please check your card details and try again with the same or another card. (Invalid account number (no such number))",
  "20017": "Customer cancellation",
  "20018": "Customer dispute",
  "20019": "Re-enter transaction / Transaction has expired",
  "20020": "Invalid response",
  "20021": "No action taken (unable to back out prior transaction)",
  "20022": "Suspected malfunction",
  "20023": "Unacceptable transaction fee",
  "20024": "File update not supported by the receiver",
  "20025":
    "Unable to locate record on file / Account number is missing from the inquiry",
  "20026": "Duplicate file update record",
  "20027": "File update field edit error",
  "20028": "File is temporarily unavailable",
  "20029": "File update not successful",
  "20030":
    "The payment failed due to a technical issue. Please try again with the same card, or use a different card. (Format error)",
  "20031": "Bank not supported by Switch",
  "20032": "Completed partially",
  "20038": "Allowable PIN tries exceeded",
  "20039": "No credit account",
  "20040": "Requested function not supported",
  "20042": "No universal value/amount",
  "20044": "No investment account",
  "20046":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Bank decline)",
  "20051":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Insufficient funds)",
  "20052": "No current (checking) account",
  "20053": "No savings account",
  "20054": "Expired card",
  "20055": "Incorrect PIN / PIN validation not possible",
  "20056": "No card record",
  "20057":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Transaction not permitted to cardholder / Domestic debit transaction not allowed (Regional use only))",
  "20058": "Transaction not permitted to terminal",
  "20059":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Suspected fraud)",
  "20060": "Card acceptor contact acquirer",
  "20061":
    "Occurs if the defined amount is exceeded for the account or card. Refer to the page on recommendation codes for suggested action. (Activity amount limit exceeded)",
  "20062":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Restricted card)",
  "20063": "Security violation",
  "20064":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Transaction does not fulfil AML requirement)",
  "20065":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Exceeds Withdrawal Frequency Limit)",
  "20066": "Card acceptor call acquirer security",
  "20067": "Hard capture - Pick up card at ATM",
  "20068":
    "The payment failed due to a technical issue. Please try again with the same card, or use a different card. (Response received too late / Timeout / Transaction rejected / Internal error)",
  "20075":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Allowable PIN-entry tries exceeded)",
  "20078":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Blocked at first use - transaction from new or replacement card that is not properly unblocked)",
  "20082":
    "No security model / PIN cryptographic error found (error found by VIC security module during PIN decryption) / Negative CAM, dCVV, iCVV, or CVV results",
  "20083": "No accounts",
  "20084": "No PBF",
  "20085": "PBF update error",
  "20086": "ATM malfunction / Invalid authorization type",
  "20087":
    "The payment failed, please check your card details and try again with the same or another card. (Bad track data (invalid CVV and/or expiry date))",
  "20088": "Unable to dispense/process",
  "20091":
    "The payment failed due to a technical issue. Please try again with the same card, or use a different card. (Issuer unavailable or switch is inoperative)",
  "20093":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Transaction cannot be completed; violation of law)",
  "20096":
    "The payment failed due to a technical issue. Please try again with the same card, or use a different card. (System malfunction)",
  "20099":
    "The payment failed due to a technical issue. If the issue persists please contact us. (Other / Unidentified responses)",
  "2006P":
    "Cardholder could not be identified from their ID documentation as part of Know Your Customer (KYC) checks. The cardholder should contact their issuing bank to resolve. (Cardholder ID verification failed)",
  "200R1":
    "The cardholder has canceled this subscription (Issuer initiated a stop payment (revocation order) for this authorization)",
  "200R3":
    "The cardholder has canceled all subscriptions (Issuer initiated a stop payment (revocation order) for all authorizations)",
  "20100":
    "The payment failed due to invalid expiry date. Please try again providing the correct value. (Invalid expiry date format)",
  "20102":
    "The payment failed due to a technical issue. If the issue persists please contact us. (Invalid merchant / wallet ID)",
  "20103":
    "The payment has been declined by your bank. Please try again with a different card or contact your bank for further support. (Card type / payment method not supported)",
  "20104":
    "The payment failed due to a technical issue. Please try again with the same card, or use a different card. (Gateway reject - Invalid transaction)",
  "20105":
    "The payment failed due to a technical issue. Please try again with the same card, or use a different card. (Gateway reject - Violation)",
  "20111":
    "The payment reversal has already been processed. (Transaction already reversed)",
  "20112":
    "The payment failed due to a technical issue. Please contact us with the payment reference number. (Merchant not Mastercard SecureCode enabled)",
  "20117":
    "The payment failed due to a technical issue. If the issue persists please contact us. (Invalid API version)",
  "20118":
    "The payment failed due to a technical issue. If the issue persists please contact us. (Transaction pending)",
  "20119":
    "The payment failed due to a technical issue. If the issue persists please contact us. (Invalid batch data and/or batch data is missing)",
  "20120":
    "The payment failed due to a technical issue. If the issue persists please contact us. (Invalid customer/user)",
  "20123":
    "The payment failed due to a technical issue. If the issue persists please contact us. (Missing basic data: zip, addr, member)",
  "20152":
    "The payment has expired due to inactivity. Please try again with the same card, or use a different card. (Initial 3DS transaction not completed within 15 minutes)",
  "20153":
    "The payment failed due to a technical issue. Please try again with the same card, or use a different card. (3DS system malfunction)",
  "20154":
    "The payment declined due to Strong Customer Authentication (3DS). Please try again with the same card, or use a different card. (3DS authentication required)",
  "20179":
    "Occurs when transaction has invalid card data. Refer to the page on recommendation codes for suggested action. (Lifecycle)",
  "20182":
    "Occurs when a transaction does not comply with card policy. Refer to the page on recommendation codes for suggested action. (Policy)",
  "20183":
    "Occurs when a transaction is suspected to be fraudulent. Refer to the page on recommendation codes for suggested action. (Security)",
  "20089": "Administration error",
  "20090": "Cut-off in progress",
  "20092": "Destination cannot be found for routing",
  "20094": "Duplicate transmission / invoice",
  "20095": "Reconcile error",
  "20097": "Reconciliation totals reset",
  "20098": "MAC error",
  "200N0": "Force STIP",
  "200N7": "Decline for CVV2 failure",
  "200O5": "PIN required",
  "200P1": "Over daily limit",
  "200P9": "Limit exceeded. Enter a lesser value.",
  "200S4": "PTLF full",
  "200T2": "Invalid transaction date",
  "200T3": "Card not supported",
  "200T5": "CAF status = 0 or 9",
  "20101": "No Account / No Customer (Token is incorrect or invalid)",
  "20106": "Unsupported currency",
  "20107": "Billing address is missing",
  "20108": "Declined - Updated cardholder available",
  "20109":
    "Transaction already reversed (voided) / Previous message located for a repeat or reversal, but repeat or reversal data is inconsistent with the original message / Capture is larger than initial authorized value",
  "20110": "Authorization completed",
  "20113": "Invalid property",
  "20114": "Token is incorrect",
  "20115": "Missing / Invalid lifetime",
  "20116": "Invalid encoding",
  "20121": "Transaction limit for merchant/terminal exceeded",
  "20124": "Missing CVV value, required for ecommerce transaction",
  "20150": "Card not 3D Secure (3DS) enabled",
  "20151": "Cardholder failed 3DS authentication",
  "20155": "3DS authentication service provided invalid authentication result",
  "20156": "Requested function not supported by the acquirer",
  "20157": "Invalid merchant configurations - Contact Support",
  "20158": "Refund validity period has expired",
  "20193": "Invalid country code",
  "30004":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Pick up card (No fraud))",
  "30007":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Pick up card - Special conditions)",
  "30015":
    "The payment has been declined due to incorrect details. Please try again with updated details. (No such issuer)",
  "30016":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Issuer does not allow online gambling payout)",
  "30017":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Issuer does not allow original credit transaction)",
  "30018":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Issuer does not allow money transfer payout)",
  "30019":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Issuer does not allow non-money transfer payout)",
  "30020":
    "The payment failed due to a technical issue. If the issue persists please contact us. (Invalid amount)",
  "30021":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Total amount limit reached)",
  "30022":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Total transaction count limit reached)",
  "30033":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Expired card - Pick up)",
  "30034":
    "The payment has been declined by your bank. Please contact your bank for further support. (Suspected fraud - Pick up)",
  "30035":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Contact acquirer - Pick up)",
  "30036":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Restricted card - Pick up)",
  "30037":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Call acquirer security - Pick up)",
  "30038":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Allowable PIN tries exceeded - Pick up)",
  "30041":
    "The payment has been declined by your bank. Please try a different card or contact your bank for further support. (Lost card - Pick up)",
  "30043":
    "The cardholder’s bank has declined the payment because the card has been reported stolen. (Stolen card - Pick up)",
  "30044":
    "Transaction was initiated from an anonymous, non-reloadable prepaid card and for an amount greater than 50 EUR. Due to the AMLD5 directive, it cannot be fulfilled. (Transaction rejected - AMLD5)",
  "30045":
    "If the fund transfer type is not among the list that was configured for allowed funds transfer types, the transaction would fail. (Invalid payout fund transfer type)",
  "30046":
    "The payment has been declined by your bank. Please contact your bank for further support. (Closed account)",
  "40101":
    "The payment failed due to a security violation. If the issue persists please contact us. (Risk blocked transaction)",
  "40201": "Gateway reject - card number blacklist",
  "40202": "Gateway reject - IP address blacklist",
  "40203": "Gateway reject - email blacklist",
  "40204": "Gateway reject - phone number blacklist",
  "40205": "Gateway Reject - BIN number blacklist",
};
