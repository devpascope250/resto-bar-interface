import { DateUtils } from '@/lib/date-utils';
import React from 'react';
import QRCode from 'react-qr-code';

interface ReceiptProps {
  receiptData: {
    tradeName: string;
    address: string;
    tin: string;
    clientId?: string;
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
    sdcId: string;
    receiptNumber: string;
    internalData: string;
    receiptSignature: string;
    mrc: string;
    thankYouMessage?: string;
    commercialMessage?: string;
  };
}

const Receipt: React.FC<ReceiptProps> = ({ receiptData }) => {
  const {
    tradeName,
    address,
    tin,
    clientId,
    items,
    totals,
    payment,
    itemsNumber,
    date,
    time,
    sdcId,
    receiptNumber,
    internalData,
    receiptSignature,
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
      <div style={{ textAlign: 'center', borderBottom: '1px dashed #000', paddingBottom: '2mm' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{tradeName}</div>
        <div>{address}</div>
        <div>TIN: {tin}</div>
      </div>

      {/* Welcome Message */}
      <div style={{ textAlign: 'center' }}>
        Welcome to our shop
        {clientId && <div>Client ID: {clientId}</div>}
      </div>

      {/* Separator */}
      <div style={{ borderBottom: '1px dashed #000', margin: '1mm 0' }}></div>

      {/* Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.name}</span>
              <span>{item.total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
              <span>{item.quantity.toFixed(2)}x {item.unitPrice.toFixed(2)}</span>
              <span>{item.taxType}</span>
            </div>
            {item.discount && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                <span>discount -{item.discount}%</span>
                <span>{(item.total * (1 - item.discount/100)).toFixed(2)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Separator */}
      <div style={{ borderBottom: '1px dashed #000', margin: '1mm 0' }}></div>

      {/* Totals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>TOTAL</span>
          <span>{totals.total.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
          <span>TOTAL A-EX</span>
          <span>{totals.totalAEx.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
          <span>TOTAL B-18.00%</span>
          <span>{totals.totalB.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
          <span>TOTAL TAX B</span>
          <span>{totals.totalTaxB.toFixed(2)}</span>
        </div>
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

        
        <div style={{ fontWeight: 'normal', textAlign: 'center',fontSize: '13px' }}>Internal Data:</div>
        <div style={{ wordBreak: 'break-all', textAlign: 'center'  }}>{internalData?.padEnd(40,'')?.match(/.{1,4}/g)?.join('-')}</div>
        <div style={{ fontWeight: 'normal', textAlign: 'center' }}>Receipt Signature:</div>
        <div style={{ wordBreak: 'break-all', textAlign: 'center'  }}>{receiptSignature?.padEnd(20,'')?.match(/.{1,4}/g)?.join('-')}</div>
      </div>

      {/* QR Code */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2mm 0' }}>
        <QRCode 
          value={`${tradeName}|${receiptNumber}|${date}|${time}|${totals.total}`} 
          size={80} 
        />
      </div>

        {/* Separator */}
      <div style={{ borderBottom: '1px dashed #000', margin: '1mm 0', gap: '1mm' }}></div>


      {/* CIS Information */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <span>RECEIPT NUMBER:</span>
            <span>{receiptNumber}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <span>DATE: {DateUtils.parse(date).toLocaleDateString()}</span>
            <span>TIME: {DateUtils.parse(time).toLocaleTimeString()}</span>
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

export default Receipt;