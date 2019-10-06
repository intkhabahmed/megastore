import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() {
  }

  downloadPdf() {
    pdfMake.createPdf(this.dd).download()
  }

  printPdf() {
    pdfMake.createPdf(this.dd).open({}, window)
  }

  dd = {

    footer: {
      columns: [
        { text: 'This is a Computer Generated Invoice', style: 'documentFooterCenter' }
      ]
    },
    content: [
      // Header
      {
        columns: [
          [
            {
              text: 'INVOICE',
              style: 'invoiceTitle',
              width: '*'
            },
            {
              stack: [
                {
                  columns: [
                    {
                      text: 'Invoice #',
                      style: 'invoiceSubTitle',
                      width: '*'

                    },
                    {
                      text: '00001',
                      style: 'invoiceSubValue',
                      width: 100

                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'Date Issued',
                      style: 'invoiceSubTitle',
                      width: '*'
                    },
                    {
                      text: 'June 01, 2016',
                      style: 'invoiceSubValue',
                      width: 100
                    }
                  ]
                },
                {
                  columns: [
                    {
                      text: 'Due Date',
                      style: 'invoiceSubTitle',
                      width: '*'
                    },
                    {
                      text: 'June 05, 2016',
                      style: 'invoiceSubValue',
                      width: 100
                    }
                  ]
                },
              ]
            }
          ],
        ],
      },
      // Billing Headers
      {
        columns: [
          {
            text: 'Billing From',
            style: 'invoiceBillingTitle',

          },
          {
            text: 'Billing To',
            style: 'invoiceBillingTitle',

          },
        ]
      },
      // Billing Details
      {
        columns: [
          {
            text: 'Maa Taluja Creations',
            style: 'invoiceBillingDetails'
          },
          {
            text: 'Intkhab Ahmed',
            style: 'invoiceBillingDetails'
          },
        ]
      },
      // Billing Address Title
      {
        columns: [
          {
            text: 'Address',
            style: 'invoiceBillingAddressTitle'
          },
          {
            text: 'Address',
            style: 'invoiceBillingAddressTitle'
          },
        ]
      },
      // Billing Address
      {
        columns: [
          {
            text: 'Rane Vihar, House No 264/218, \n Savlem, Alto-Pilerne, \n   Bardez, GOA-40251 \n GSTIN/UIN: 30AWXPS1609N1ZY \n State Name: Goa, Code: 30 \n E-Mail: maatalujacreations@gmail.com',
            style: 'invoiceBillingAddress'
          },
          {
            text: '1111 Other street 25  New-York City NY 00000   USA',
            style: 'invoiceBillingAddress'
          },
        ]
      },
      // Line breaks
      '\n\n',
      // Items
      {
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ['*', 40, 'auto', 40, 'auto', 80],

          body: [
            // Table Header
            [
              {
                text: 'Product',
                style: 'itemsHeader'
              },
              {
                text: 'Qty',
                style: ['itemsHeader', 'center']
              },
              {
                text: 'Price',
                style: ['itemsHeader', 'center']
              },
              {
                text: 'Tax',
                style: ['itemsHeader', 'center']
              },
              {
                text: 'Discount',
                style: ['itemsHeader', 'center']
              },
              {
                text: 'Total',
                style: ['itemsHeader', 'center']
              }
            ],
            // Items
            // Item 1
            [
              [
                {
                  text: 'Item 1',
                  style: 'itemTitle'
                },
                {
                  text: 'Item Description',
                  style: 'itemSubTitle'

                }
              ],
              {
                text: '1',
                style: 'itemNumber'
              },
              {
                text: '$999.99',
                style: 'itemNumber'
              },
              {
                text: '0%',
                style: 'itemNumber'
              },
              {
                text: '0%',
                style: 'itemNumber'
              },
              {
                text: '$999.99',
                style: 'itemTotal'
              }
            ],
            // Item 2
            [
              [
                {
                  text: 'Item 2',
                  style: 'itemTitle'
                },
                {
                  text: 'Item Description',
                  style: 'itemSubTitle'

                }
              ],
              {
                text: '1',
                style: 'itemNumber'
              },
              {
                text: '$999.99',
                style: 'itemNumber'
              },
              {
                text: '0%',
                style: 'itemNumber'
              },
              {
                text: '0%',
                style: 'itemNumber'
              },
              {
                text: '$999.99',
                style: 'itemTotal'
              }
            ],
            // END Items
          ]
        }, // table
        //  layout: 'lightHorizontalLines'
      },
      // TOTAL
      {
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 0,
          widths: ['*', 80],

          body: [
            // Total
            [
              {
                text: 'Subtotal',
                style: 'itemsFooterSubTitle'
              },
              {
                text: '$2000.00',
                style: 'itemsFooterSubValue'
              }
            ],
            [
              {
                text: 'Tax 21%',
                style: 'itemsFooterSubTitle'
              },
              {
                text: '$523.13',
                style: 'itemsFooterSubValue'
              }
            ],
            [
              {
                text: 'TOTAL',
                style: 'itemsFooterTotalTitle'
              },
              {
                text: '$2523.93',
                style: 'itemsFooterTotalValue'
              }
            ],
          ]
        }, // table
        layout: 'lightHorizontalLines'
      },
    ],
    styles: {
      // Document Footer
      documentFooterLeft: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: 'left'
      },
      documentFooterCenter: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: 'center'
      },
      documentFooterRight: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: 'right'
      },
      // Invoice Title
      invoiceTitle: {
        fontSize: 22,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 15]
      },
      // Invoice Details
      invoiceSubTitle: {
        fontSize: 12,
        alignment: 'right'
      },
      invoiceSubValue: {
        fontSize: 12,
        alignment: 'right'
      },
      // Billing Headers
      invoiceBillingTitle: {
        fontSize: 14,
        bold: true,
        alignment: 'left',
        margin: [0, 20, 0, 5],
      },
      // Billing Details
      invoiceBillingDetails: {
        alignment: 'left'

      },
      invoiceBillingAddressTitle: {
        margin: [0, 7, 0, 3],
        bold: true
      },
      invoiceBillingAddress: {

      },
      // Items Header
      itemsHeader: {
        margin: [0, 5, 0, 5],
        bold: true
      },
      // Item Title
      itemTitle: {
        bold: true,
      },
      itemSubTitle: {
        italics: true,
        fontSize: 11
      },
      itemNumber: {
        margin: [0, 5, 0, 5],
        alignment: 'center',
      },
      itemTotal: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: 'center',
      },

      // Items Footer (Subtotal, Total, Tax, etc)
      itemsFooterSubTitle: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: 'right',
      },
      itemsFooterSubValue: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: 'center',
      },
      itemsFooterTotalTitle: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: 'right',
      },
      itemsFooterTotalValue: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: 'center',
      },
      signaturePlaceholder: {
        margin: [0, 70, 0, 0],
      },
      signatureName: {
        bold: true,
        alignment: 'center',
      },
      signatureJobTitle: {
        italics: true,
        fontSize: 10,
        alignment: 'center',
      },
      notesTitle: {
        fontSize: 10,
        bold: true,
        margin: [0, 50, 0, 3],
      },
      notesText: {
        fontSize: 10
      },
      center: {
        alignment: 'center',
      },
    },
    defaultStyle: {
      columnGap: 20,
    }
  }
}
