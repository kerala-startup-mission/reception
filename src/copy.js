export const VISIT_TYPES = ['KSUM', 'Incubated Company']

// Shared so the client, the review row and the tests cannot drift from the
// exact string that goes on the wire and keys the owners table.
export const APPOINTMENT = 'I have an Appointment'

// Canonical purpose values — always sent to the API in English
export const PURPOSES = {
  KSUM: [
    'Financial Assistance',
    'Space Requirement',
    'Fab Lab',
    'Maker Village',
    'Incubation and Other Startup Enquiries',
    'Vendors and Suppliers to KSUM',
    APPOINTMENT,
  ],
  'Incubated Company': [
    'Meeting',
    'Interview',
    'Internship',
    'Repair/Maintenance',
    'Other',
  ],
}

export const COPY = {
  en: {
    kicker: 'Digital Reception',
    langTitle: 'Select your language',

    visitTitle: 'Who are you here for?',
    visitSub: 'This tells us who to notify.',
    visitLabels: {
      KSUM: 'Kerala Startup Mission',
      'Incubated Company': 'Incubated Company',
    },
    visitNotes: {
      KSUM: 'Funding, space, labs and general enquiries',
      'Incubated Company': 'A startup based in this building',
    },

    detailsTitle: 'Your details',
    detailsSub: 'Please tell us who is visiting today.',
    name: 'Full name',
    namePh: 'e.g. Richard Hendrix',
    phone: 'Phone',
    phonePh: '10-digit mobile number',
    email: 'Email',
    emailPh: 'name@example.com',
    org: 'Organisation',
    orgPh: 'Company, college or institution',
    company: 'Company you are visiting',
    companyPh: 'Name of the startup',

    purposeTitle: 'Purpose of visit',
    purposeSub: 'Choose the one that fits best.',
    otherPh: 'Tell us briefly why you are here',
    meetWho: 'Who are you here to meet?',
    meetWhoPh: 'Name of the person',

    reviewTitle: 'Review and confirm',
    reviewSub: 'Check the sheet below before you check in.',
    sheet: 'Visitor sheet',

    thanks: 'Thank you',
    doneSub: 'Our representative will meet you shortly. Kindly wait in the lobby area.',
    doneSubIncubated:
      'Please wait in the lobby and contact the representative from the company to proceed.',
    token: 'Token',
    checkedIn: 'Checked in',
    contactTitle: 'Your point of contact',
    escalateIn: 'Your approximate waiting time is: ',
    escalate: 'Escalate',
    escalating: 'Notifying…',
    escalated: 'Case Escalated',
    escalateFailed: 'Could not notify. Please approach the front desk.',
    loadingToken: 'Fetching your token…',
    notFoundTitle: 'Not found',
    notFoundSub: 'That check-in reference does not exist. Please check in again.',

    back: 'Back',
    continue: 'Continue',
    checkIn: 'Check in',
    checkingIn: 'Checking in',
    newVisitor: 'New visitor',

    reqVisit: 'Please choose who you are visiting.',
    reqDetails: 'Please enter your name, phone number and email.',
    reqCompany: 'Please enter the company you are visiting.',
    reqPurpose: 'Please select a purpose of visit.',
    reqOther: 'Please tell us the reason for your visit.',
    reqMeetWho: 'Please tell us who you are here to meet.',
    sendFailed: 'Could not register the visit. Please try again.',

    notes: {
      'Financial Assistance': 'Grant & Seed Funding Schemes',
      'Space Requirement': 'Coworking space & Dedicated space',
      'Fab Lab': 'Digital fabrication and prototyping',
      'Maker Village': 'Electronics and Hardware Incubator',
      'Incubation and Other Startup Enquiries':
        'Anything else related to incubation and startup',
      'Vendors and Suppliers to KSUM': 'Deliveries, services and procurement',
      [APPOINTMENT]: 'Scheduled meeting with a KSUM team member',
      Meeting: 'A scheduled or walk-in meeting',
      Interview: 'Attending a job interview',
      Internship: 'Internship joining or discussion',
      'Repair/Maintenance': 'Service, repair or installation work',
      Other: 'Something else — tell us below',
    },
    labels: {
      'Financial Assistance': 'Financial Assistance',
      'Space Requirement': 'Space Requirement',
      'Fab Lab': 'Fab Lab',
      'Maker Village': 'Maker Village',
      'Incubation and Other Startup Enquiries': 'Incubation and Other Startup Enquiries',
      'Vendors and Suppliers to KSUM': 'Vendors and Suppliers to KSUM',
      [APPOINTMENT]: APPOINTMENT,
      // kept: historical sheet rows still carry this value, and the token page
      // renders labels[requirement] — dropping it would blank their purpose
      'General Enquiry': 'General Enquiry',
      Meeting: 'Meeting',
      Interview: 'Interview',
      Internship: 'Internship',
      'Repair/Maintenance': 'Repair/Maintenance',
      Other: 'Other',
    },
    keys: {
      visit: 'Visit',
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      org: 'Organisation',
      company: 'Visiting',
      meeting: 'Meeting',
      purpose: 'Purpose',
    },
  },

  ml: {
    kicker: 'ഡിജിറ്റൽ റിസപ്ഷൻ',
    langTitle: 'ഭാഷ തിരഞ്ഞെടുക്കുക',

    visitTitle: 'ആരെയാണ് സന്ദർശിക്കുന്നത്?',
    visitSub: 'ആരെ അറിയിക്കണമെന്ന് ഇത് ഞങ്ങളോട് പറയുന്നു.',
    visitLabels: {
      KSUM: 'കേരള സ്റ്റാർട്ടപ്പ് മിഷൻ',
      'Incubated Company': 'ഇൻകുബേറ്റഡ് കമ്പനി',
    },
    visitNotes: {
      KSUM: 'ഫണ്ടിംഗ്, സ്ഥലം, ലാബുകൾ, പൊതു അന്വേഷണങ്ങൾ',
      'Incubated Company': 'ഈ കെട്ടിടത്തിലുള്ള ഒരു സ്റ്റാർട്ടപ്പ്',
    },

    detailsTitle: 'നിങ്ങളുടെ വിവരങ്ങൾ',
    detailsSub: 'ഇന്ന് സന്ദർശിക്കുന്നത് ആരാണെന്ന് അറിയിക്കുക.',
    name: 'പൂർണ്ണ നാമം',
    namePh: 'ഉദാ. റിച്ചാർഡ് ഹെൻഡ്രിക്സ്',
    phone: 'ഫോൺ നമ്പർ',
    phonePh: '10 അക്ക മൊബൈൽ നമ്പർ',
    email: 'ഇമെയിൽ',
    emailPh: 'name@example.com',
    org: 'സ്ഥാപനം',
    orgPh: 'കമ്പനി, കോളേജ് അല്ലെങ്കിൽ സ്ഥാപനം',
    company: 'സന്ദർശിക്കുന്ന കമ്പനി',
    companyPh: 'സ്റ്റാർട്ടപ്പിന്റെ പേര്',

    purposeTitle: 'സന്ദർശന ഉദ്ദേശ്യം',
    purposeSub: 'ഏറ്റവും അനുയോജ്യമായത് തിരഞ്ഞെടുക്കുക.',
    otherPh: 'സന്ദർശന കാരണം ചുരുക്കി എഴുതുക',
    meetWho: 'ആരെയാണ് കാണാൻ വന്നത്?',
    meetWhoPh: 'വ്യക്തിയുടെ പേര്',

    reviewTitle: 'പരിശോധിച്ച് സ്ഥിരീകരിക്കുക',
    reviewSub: 'ചെക്ക് ഇൻ ചെയ്യുന്നതിന് മുൻപ് വിവരങ്ങൾ പരിശോധിക്കുക.',
    sheet: 'സന്ദർശക വിവരപത്രിക',

    thanks: 'നന്ദി',
    doneSub: 'ഞങ്ങളുടെ പ്രതിനിധി ഉടൻ നിങ്ങളെ കാണും. ദയവായി ലോബിയിൽ കാത്തിരിക്കുക.',
    doneSubIncubated:
      'ദയവായി ലോബിയിൽ കാത്തിരിക്കുക, തുടരാൻ കമ്പനിയുടെ പ്രതിനിധിയുമായി ബന്ധപ്പെടുക.',
    token: 'ടോക്കൺ',
    checkedIn: 'ചെക്ക് ഇൻ ചെയ്തത്',
    contactTitle: 'നിങ്ങളെ സഹായിക്കുന്ന വ്യക്തി',
    escalateIn: 'നിങ്ങളുടെ ഏകദേശ കാത്തിരിപ്പ് സമയം:',
    escalate: 'എസ്കലേറ്റ് ചെയ്യുക',
    escalating: 'അറിയിക്കുന്നു…',
    escalated: 'എസ്ക്കലേഷൻ നടന്നു',
    escalateFailed: 'അറിയിക്കാൻ കഴിഞ്ഞില്ല. ദയവായി റിസപ്ഷൻ ഡെസ്കിൽ സമീപിക്കുക.',
    loadingToken: 'ടോക്കൺ എടുക്കുന്നു…',
    notFoundTitle: 'കണ്ടെത്തിയില്ല',
    notFoundSub: 'ഈ ചെക്ക് ഇൻ റഫറൻസ് നിലവിലില്ല. വീണ്ടും ചെക്ക് ഇൻ ചെയ്യുക.',

    back: 'പിന്നോട്ട്',
    continue: 'തുടരുക',
    checkIn: 'ചെക്ക് ഇൻ',
    checkingIn: 'അയക്കുന്നു',
    newVisitor: 'പുതിയ സന്ദർശകൻ',

    reqVisit: 'ആരെയാണ് സന്ദർശിക്കുന്നതെന്ന് തിരഞ്ഞെടുക്കുക.',
    reqDetails: 'പേര്, ഫോൺ നമ്പർ, ഇമെയിൽ എന്നിവ നൽകുക.',
    reqCompany: 'സന്ദർശിക്കുന്ന കമ്പനിയുടെ പേര് നൽകുക.',
    reqPurpose: 'സന്ദർശന ഉദ്ദേശ്യം തിരഞ്ഞെടുക്കുക.',
    reqOther: 'സന്ദർശന കാരണം എഴുതുക.',
    reqMeetWho: 'ആരെയാണ് കാണാൻ വന്നതെന്ന് അറിയിക്കുക.',
    sendFailed: 'രജിസ്റ്റർ ചെയ്യാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.',

    notes: {
      'Financial Assistance': 'ഗ്രാന്റ്, സീഡ് ഫണ്ടിംഗ് പദ്ധതികൾ',
      'Space Requirement': 'കോ‑വർക്കിംഗ് സ്ഥലവും പ്രത്യേക സ്ഥലവും',
      'Fab Lab': 'ഡിജിറ്റൽ ഫാബ്രിക്കേഷനും പ്രോട്ടോടൈപ്പിംഗും',
      'Maker Village': 'ഇലക്ട്രോണിക്സ്, ഹാർഡ്‌വെയർ ഇൻകുബേറ്റർ',
      'Incubation and Other Startup Enquiries':
        'ഇൻകുബേഷനും സ്റ്റാർട്ടപ്പുമായി ബന്ധപ്പെട്ട മറ്റെന്തും',
      'Vendors and Suppliers to KSUM': 'ഡെലിവറി, സേവനങ്ങൾ, സംഭരണം',
      [APPOINTMENT]: 'കെഎസ്‌യുഎം ടീം അംഗവുമായി നിശ്ചയിച്ച കൂടിക്കാഴ്ച',
      Meeting: 'നിശ്ചയിച്ചതോ അല്ലാത്തതോ ആയ കൂടിക്കാഴ്ച',
      Interview: 'ജോലി അഭിമുഖത്തിന് ഹാജരാകുന്നു',
      Internship: 'ഇന്റേൺഷിപ്പ് ചേരൽ അല്ലെങ്കിൽ ചർച്ച',
      'Repair/Maintenance': 'സർവീസ്, അറ്റകുറ്റപ്പണി, ഇൻസ്റ്റാളേഷൻ',
      Other: 'മറ്റെന്തെങ്കിലും — താഴെ എഴുതുക',
    },
    labels: {
      'Financial Assistance': 'സാമ്പത്തിക സഹായം',
      'Space Requirement': 'സ്ഥല ആവശ്യകത',
      'Fab Lab': 'ഫാബ് ലാബ്',
      'Maker Village': 'മേക്കർ വില്ലേജ്',
      'Incubation and Other Startup Enquiries': 'ഇൻകുബേഷനും മറ്റ് സ്റ്റാർട്ടപ്പ് അന്വേഷണങ്ങളും',
      'Vendors and Suppliers to KSUM': 'കെഎസ്‌യുഎം വെണ്ടർമാരും വിതരണക്കാരും',
      [APPOINTMENT]: 'എനിക്ക് അപ്പോയിന്റ്മെന്റ് ഉണ്ട്',
      'General Enquiry': 'പൊതു അന്വേഷണം',
      Meeting: 'മീറ്റിംഗ്',
      Interview: 'അഭിമുഖം',
      Internship: 'ഇന്റേൺഷിപ്പ്',
      'Repair/Maintenance': 'അറ്റകുറ്റപ്പണി',
      Other: 'മറ്റുള്ളവ',
    },
    keys: {
      visit: 'സന്ദർശനം',
      name: 'പേര്',
      phone: 'ഫോൺ',
      email: 'ഇമെയിൽ',
      org: 'സ്ഥാപനം',
      company: 'സന്ദർശിക്കുന്നത്',
      meeting: 'കാണേണ്ട വ്യക്തി',
      purpose: 'ഉദ്ദേശ്യം',
    },
  },
}
