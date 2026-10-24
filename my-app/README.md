# Granitura — Natural Stone & Export

A professional website concept for Granitura, focused on natural stone sourcing, granite, marble, paving stones, export enquiries, and B2B lead management.

## Features

- Professional, responsive company website
- Granite, marble, and paving stone product sections
- Export and bulk-order enquiry process
- Customer enquiry form
- Interactive CRM demonstration
- Lead pipeline: New Enquiry, Qualified, Quotation Sent, Won
- Sales pipeline metrics and lead tracking

## Tech Stack

- **Frontend:** Next.js and TypeScript
- **Hosting:** Vercel
- **Database:** MongoDB Atlas
- **Email notifications:** Nodemailer or an email service
- **CRM:** Custom lead management system

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

 
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Edit `app/page.tsx` to update the main page in your Next.js App Router project.

## Planned CRM Integration

The production CRM should support:

- Customer and company records
- Export enquiries and destination markets
- Material specifications and quantities
- Follow-up dates and sales activities
- Quotations and opportunity values
- Lead status updates
- Email notifications
- Secure administrator login

## Environment Variables

Store private configuration in `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
```

Never expose database credentials or email API keys in frontend code or commit them to Git.

## Deployment

1. Push the Next.js project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Deploy the application.
5. Test enquiry submission, database storage, and email delivery.

## Important

The current website concept includes demo CRM data and a demonstration enquiry form. Real database storage, email delivery, authentication, and CRM integration must be implemented before production use.
