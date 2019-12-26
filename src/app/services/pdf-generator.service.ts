import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { Order } from '../models/order';
import { OrderSummary } from '../models/order-summary';
import { JsonUtils } from '../utils/json-utils';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor(private jsonUtils: JsonUtils) {
  }

  header = [
    {
      text: 'S.No',
      style: 'itemsHeader'
    },
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
  ]

  rows = []

  /* downloadPdf() {
    pdfMake.createPdf(this.dd()).download()
  } */

  createRows(orderSummary: OrderSummary): any[] {
    var dataRows = []
    dataRows.push(this.header)
    var index = 1
    orderSummary.cartItems.forEach(item => {
      dataRows.push([
        {
          text: index,
          style: 'itemNumber'
        },
        [
          {
            text: item.product.name,
            style: 'itemTitle'
          },
          {
            text: item.product.category,
            style: 'itemSubTitle'

          }
        ],
        {
          text: item.noOfItems,
          style: 'itemNumber'
        },
        {
          text: `Rs ${item.product.price[item.product.selectedIndex][item.product.subIndex]}`,
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
          text: `Rs ${item.itemsCost}`,
          style: 'itemTotal'
        }
      ])
      index++
    })
    return dataRows
  }

  printPdf(order: Order) {
    if (typeof order.orderSummary === 'string') {
      order.orderSummary = this.jsonUtils.parseJson(order.orderSummary)
    }
    if (typeof order.address === 'string') {
      order.address = this.jsonUtils.parseJson(order.address)
    }
    this.rows = this.createRows(order.orderSummary)
    pdfMake.createPdf(this.dd(order)).print()
  }

  dd(order: Order): any {
    return {

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
                        text: order.invoiceId,
                        style: 'invoiceSubValue',
                        width: 100

                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        text: 'Order #',
                        style: 'invoiceSubTitle',
                        width: '*'

                      },
                      {
                        text: order.orderNo,
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
                        text: new Date(order.orderDate).toDateString(),
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
                        text: new Date(order.orderDate).toDateString(),
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
              text: 'Craft Mega Store',
              style: 'invoiceBillingDetails'
            },
            {
              text: `${order.address.firstName} ${order.address.lastName}`,
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
              text: `${order.address.address}, \n${order.address.city}, ${order.address.state} - ${order.address.postalCode} \nMobile: ${order.address.mobile} \nE-Mail: ${order.user.email}`,
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
            widths: [30, '*', 40, 'auto', 40, 'auto', 80],

            body: this.rows
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
                  text: `Rs ${order.orderSummary.totalProductCost}`,
                  style: 'itemsFooterSubValue'
                }
              ],
              [
                {
                  text: 'Shipping Cost',
                  style: 'itemsFooterSubTitle'
                },
                {
                  text: `Rs ${order.orderSummary.shippingCost}`,
                  style: 'itemsFooterSubValue'
                }
              ],
              [
                {
                  text: 'TOTAL',
                  style: 'itemsFooterTotalTitle'
                },
                {
                  text: `Rs ${order.orderSummary.grandTotal}`,
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
}
