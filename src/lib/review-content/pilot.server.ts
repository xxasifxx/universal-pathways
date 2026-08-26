/**
 * Server-only PILOT explainer copy. Reaches the browser only through the
 * passcode-gated review server function.
 */
import type { PilotPayload } from "./types";

export const PILOT_PAYLOAD: PilotPayload = {
  intro: [
    "A payment in lieu of taxes, or PILOT, allows a developer to make a negotiated annual payment to the township on a redeveloped property. The land remains subject to ordinary property tax. The improvements are covered by the PILOT agreement. Township officials describe the ordinary property-tax split as roughly 65 percent to the schools, 20 percent to the township, and 15 percent to the county. They describe a PILOT split as about 95 percent to the township, 5 percent to the county, and no direct payment to the schools.",
    "This page uses published reporting and Redevelopment Agency minutes. The sources are listed below. Some agreement amounts and terms are not available in the published records reviewed by the campaign.",
  ],
  split: [
    {
      id: "ordinary",
      title: "An ordinary property tax bill",
      rows: [
        { label: "School district", value: 65 },
        { label: "Township", value: 20 },
        { label: "County", value: 15 },
      ],
    },
    {
      id: "pilot",
      title: "A payment in lieu of taxes",
      rows: [
        { label: "School district", value: 0 },
        { label: "Township", value: 95 },
        { label: "County", value: 5 },
      ],
    },
  ],
  steps: [
    {
      step: "01",
      title: "A developer builds on township land",
      text: "Instead of paying normal property taxes on the full improved value, the developer negotiates a fixed annual payment with the township.",
    },
    {
      step: "02",
      title: "The township collects the payment",
      text: "The money goes to municipal accounts. Because it is not a normal property tax, it is not shared with the school district in the usual way.",
    },
    {
      step: "03",
      title: "Schools get only the land-value share",
      text: "The land keeps being taxed normally, so the district keeps that share. The value of the buildings, which is most of the value, is what moves into the negotiated payment.",
    },
    {
      step: "04",
      title: "New residents still enroll in our schools",
      text: "Apartments and homes bring students, and the district is obliged to educate them, but no part of the payment is designated for the operating budget that pays for it.",
    },
  ],
  record: [
    {
      id: "brightview",
      title: "Brightview Senior Living, Cranbury Road and Ryders Lane",
      body: [
        "The Redevelopment Agency recommended that the Township Council award a PILOT and execute a financial agreement with Brightview Senior Living Development, LLC on August 5, 2024 (Resolution 2024013), and reaffirmed that recommendation on October 21, 2024 (Resolution 2024017). The minutes record the recommendation and the unanimous vote. They do not record an annual payment amount or a term length, and neither figure appears in any document reachable from the township site.",
      ],
    },
    {
      id: "warnsdorfer",
      title: "Warnsdorfer Elementary, and what comes next",
      body: [
        "Township Administrator Joseph Criscuolo and Mayor Brad Cohen have both said PILOT money paid to repave the parking lot at Warnsdorfer Elementary. Cohen has said the township plans to fund a snack bar and outdoor bathrooms at the high school football field in 2026 or 2027. State law is the reason the list looks like that: PILOT money directed toward schools can pay for capital work, not for the operating budget that pays teachers, aides, and counselors.",
      ],
    },
    {
      id: "township-says",
      title: "What the township says",
      body: [
        "The school district continues to receive its share of tax on the land. The Board of Education sets its own budget, which is funded largely through the local tax levy.",
      ],
      quote: {
        lines: [
          "The board of ed still gets the land value on those agreements.",
          "The school system gets all the money they ask for truly.",
        ],
        attribution:
          "Township Administrator Joseph Criscuolo, at a Town Council meeting, as reported by Eyes on EB in May 2026.",
      },
    },
    {
      id: "law",
      title: "The law may change",
      body: [
        "Under current law municipalities keep the majority of PILOT payments, counties take a small share, and nothing is designated for school districts. A pending state bill, S-1807, would require that PILOT revenue be shared with districts. The Board of Education received a legislative update on exactly this in February 2026.",
      ],
    },
    {
      id: "not-on-record",
      title: "What is not on the record",
      dashed: true,
      body: [
        "The campaign could not find published annual payment amounts or term lengths for East Brunswick's PILOT agreements. Some relevant ordinances are image scans or returned errors when requested. An earlier draft cited a $1.2 million municipal reserve figure from an online comment. No published source confirmed it, so the figure was removed. The township should publish the agreement amounts and terms.",
      ],
    },
  ],
  officials: [
    "Schools receive their approved budget through the regular tax levy.",
    "PILOT money has funded school-related capital work, such as Warnsdorfer improvements.",
    "PILOTs are a standard redevelopment tool used to attract investment.",
  ],
  residents: [
    "Capital dollars cannot pay for teachers, aides, counselors, or daily programs.",
    "New development brings more students without matching operating revenue for the district.",
    "The amounts and terms of individual agreements are not posted anywhere a resident can read them.",
  ],
  actions: [
    "Use the board's public authority to ask for the annual payment, the term, and the operating-revenue impact of every PILOT agreement before it is signed.",
    "Ask how each deal changes the township tax base and residents' share of local taxes.",
    "Push for terms that protect residents from higher taxes and fees, and that invest in the schools that attract families and support future resident income.",
    "Support the state legislation that would require PILOT revenue to be shared with school districts, and publish plain-language summaries of each agreement in the meantime.",
  ],
  sources: [
    {
      label:
        "TAPinto East Brunswick, \u201cBreak Down Of PILOT Agreements, Explaining How Redevelopment Is Financed\u201d (January 30, 2026)",
      href: "https://www.tapinto.net/towns/east-brunswick/sections/business-and-finance/articles/break-down-of-pilot-agreements-explaining-how-redevelopment-is-financed",
    },
    {
      label:
        "TAPinto East Brunswick, \u201cEast Brunswick Board of Education Receives Legislative Update on PILOT Funding, School Aid\u201d (February 13, 2026)",
      href: "https://www.tapinto.net/towns/east-brunswick/sections/education/articles/east-brunswick-board-of-education-receives-legislative-update-on-pilot-funding-school-aid",
    },
    {
      label:
        "Patch, \u201cEast Brunswick Mayor Touts Improved School Board Ties, Outlines Joint Projects\u201d (February 25, 2026)",
      href: "https://patch.com/new-jersey/eastbrunswick/east-brunswick-mayor-touts-improved-school-board-ties-outlines-joint",
    },
    {
      label:
        "Eyes on EB, \u201cUnderstanding the PILOT Debate in East Brunswick After Recent Town Council Discussion\u201d (May 15, 2026)",
      href: "https://eyesoneb.com/understanding-the-pilot-debate-in-east-brunswick-after-recent-town-council-discussion/",
    },
    {
      label: "East Brunswick Redevelopment Agency minutes, August 5, 2024 (Resolution 2024013)",
      href: "https://www.eastbrunswick.org/AgendaCenter/ViewFile/Minutes/_08052024-839",
    },
    {
      label: "East Brunswick Redevelopment Agency minutes, October 21, 2024 (Resolution 2024017)",
      href: "https://publicsafety.eastbrunswick.org/AgendaCenter/ViewFile/Minutes/_10212024-859",
    },
    {
      label: "East Brunswick Redevelopment Agency, full agenda and minutes archive",
      href: "https://www.eastbrunswick.org/AgendaCenter/Redevelopment-Agency-2",
    },
    {
      label: "East Brunswick Public Schools FY2027 User Friendly Budget",
      href: "https://www.ebnet.org/departments/financial-services/budget-information/fy2027-user-friendly-budget",
    },
  ],
};