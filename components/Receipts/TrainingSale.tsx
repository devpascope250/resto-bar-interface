import { DateUtils } from '@/lib/date-utils';
import React from 'react';
import QRCode from 'react-qr-code';
import { DisplayMessage } from './A4/A4Receipt';

interface ReceiptProps {
  receiptData: {
    tradeName: string;
    address: string;
    tin: string;
    clientId?: string;
    customerName?: string;
    customerMobile?: string;
    items: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      total: number;
      taxType: string;
      discount?: number;
    }>;
    totals: {
      total: number;
      totalAEx: number;
      totalB: number;
      totalD: number;
      totalC: number;
      totalTaxB: number;
      totalTax: number;
    };
    payment: {
      method: string;
      amount: number;
    };
    itemsNumber: number;
    date: string;
    time: string;
    cisDate: Date;
    cisTime: Date;
    sdcId: string;
    receiptNumber: string;
    internalData: string;
    receiptSignature: string;
    mrc: string;
    thankYouMessage?: string;
    commercialMessage?: string;
  };
}

const TrainingSale: React.FC<ReceiptProps> = ({ receiptData }) => {
  const {
    tradeName,
    address,
    tin,
    clientId,
    customerMobile,
    customerName,
    items,
    totals,
    payment,
    itemsNumber,
    date,
    time,
    cisDate,
    cisTime,
    sdcId,
    receiptNumber,
    mrc,
    thankYouMessage,
    commercialMessage
  } = receiptData;

  return (
    <div
      className="receipt"
      style={{
        width: '80mm',
        minHeight: '100%',
        padding: '4mm',
        fontSize: '12px',
        color: '#000',
        background: '#fff',
        fontFamily: 'monospace, Courier, sans-serif',
        fontWeight: '500',
        border: '1px solid #000',
        display: 'flex',
        flexDirection: 'column',
        gap: '2mm',
        lineHeight: '1.2',
      }}
    >
      {/* Header */}
      <div className="grid grid-cols-3 items-center justify-between p-4 pb-4">
          {/* Left Logo */}
          <div>
            <img
              src="/receiptLogo/logo1.png"
              alt="Logo 1"
              className="h-13 w-auto object-contain"
            />
          </div>

          {/* Center Content */}
          <div className="text-center leading-tight">
            <DisplayMessage message={commercialMessage ?? ""} />
           
          </div>

          {/* Right Logo */}
          <div className="flex justify-end">
            <img
              src="/receiptLogo/logo2.png"
              alt="Logo 2"
              className="h-13 w-auto object-contain"
            />
          </div>
        </div>
        <div style={{ fontSize: "14px", fontWeight: "bold", textAlign: "center"}}>
        TRAINING MODE
      </div>

      <div style={{ borderBottom: '1px dashed #000', margin: '1mm 0' }}></div>

      {/* Welcome Message */}
      <div>
        <div>TIN: {clientId}</div>
        <div>CLIENT NAME: {customerName}</div>
        <div>TEL: {customerMobile}</div> 
      </div>

      {/* Separator */}
      <div style={{ borderBottom: '1px dashed #000', margin: '1mm 0' }}></div>

      {/* Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.name}</span>
              <span>{item.total.toFixed(2)} &nbsp;{item.taxType}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }} className='whitespace-nowrap'>
              <span>{item.quantity.toFixed(2)}x {item.unitPrice.toFixed(2)}</span>
            </div>
            {item.discount ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                <span>discount -{item.discount}%</span>
                <span>{(item.total * (1 - item.discount/100)).toFixed(2)}</span>
              </div>
            ) : ""}
          </div>
        ))}
      </div>
       <div style={{ borderBottom: "1px dashed #000", margin: "1mm 0" }}></div>
      <div style={{ fontSize: "14px", fontWeight: "bold", textAlign: "center"}}>
        THIS IS NOT AN OFFICIAL RECEIPT
      </div>

      {/* Separator */}
      <div style={{ borderBottom: '1px dashed #000', margin: '1mm 0' }}></div>

      {/* Totals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>TOTAL</span>
          <span>{totals.total.toFixed(2)}</span>
        </div>
        {totals.totalC ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
            }}
          >
            <span>TOTAL C</span>
            <span>{totals.totalC.toFixed(2)}</span>
          </div>
        ) : ""}
        {totals.totalD ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
            }}
          >
            <span>TOTAL D</span>
            <span>{totals.totalD.toFixed(2)}</span>
          </div>
        ): ""}
        {totals.totalAEx ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
            }}
          >
            <span>TOTAL A-EX</span>
            <span>{totals.totalAEx.toFixed(2)}</span>
          </div>
        ) : ""}
        {totals.totalB ? <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
          }}
        >
          <span>TOTAL B-18.00%</span>
          <span>{totals.totalB.toFixed(2)}</span>
        </div> : ""} 
        {totals.totalTaxB ? 
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
          }}
        >
          <span>TOTAL TAX B</span>
          <span>{totals.totalTaxB.toFixed(2)}</span>
        </div> : ""
        }
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
          <span>TOTAL TAX</span>
          <span>{totals.totalTax.toFixed(2)}</span>
        </div>
         {/* Separator */}
      <div style={{ borderBottom: '1px dashed #000', margin: '1mm 0' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>{payment.method}</span>
          <span>{payment.amount.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
          <span>ITEMS NUMBER</span>
          <span>{itemsNumber}</span>
        </div>
      </div>

      <div style={{ borderBottom: "1px dashed #000", margin: "1mm 0" }}></div>

      <div style={{ fontSize: "14px", fontWeight: "bold", textAlign: "center"}}>
        TRAINING MODE
      </div>

      {/* Separator */}
      <div style={{ borderBottom: '1px dashed #000', margin: '1mm 0', gap: '1mm' }}></div>

      {/* SDC Information */}
      <div style={{ fontSize: '10px' }}>
        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>SDC INFORMATION</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
          <span>DATE: {DateUtils.parse(date).toLocaleDateString()}</span>
          <span>TIME: {DateUtils.parse(time).toLocaleTimeString()}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
          <span>SDC ID:</span>
          <span>{sdcId}</span>
        </div> 

         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
          <span>RECEIPT NUMBER:</span>
          <span>{receiptNumber}</span>
        </div>
        </div>

      </div>


        {/* Separator */}
      <div style={{ borderBottom: '1px dashed #000', margin: '1mm 0', gap: '1mm' }}></div>


      {/* CIS Information */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <span>RECEIPT NUMBER:</span>
            <span>{receiptNumber}/{receiptNumber} TR</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <span>DATE: {cisDate.toLocaleDateString()}</span>
             <span>TIME: {cisTime.toLocaleTimeString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <span>MRC: </span>
            <span>{mrc}</span>
        </div>
      </div>
        {/* Separator */}
      <div style={{ borderBottom: '1px dashed #000', margin: '1mm 0', gap: '1mm' }}></div>


      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '2mm' }}>
        <div style={{ fontWeight: 'bold' }}>THANK YOU</div>
        <div>COME BACK AGAIN</div>
        <div style={{ fontWeight: 'bold' }}>{thankYouMessage}</div>
      </div>
    </div>
  );
};

export default TrainingSale;