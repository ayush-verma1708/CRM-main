// AddData.jsx
import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import styled from 'styled-components';
import ImportDataComponent from '../components/ImportDataComponent';

const AddData = () => {
  return (
    <PageContainer>
      <PaperContainer elevation={3}>
        <Typography variant='h4' component='h1' gutterBottom>
          Add Data
        </Typography>
        <Divider style={{ marginBottom: '24px' }} />

        {/* Import Component */}
        <SectionContainer>
          <Typography variant='h6' component='h2' gutterBottom>
            Import from Excel
          </Typography>
          <Typography variant='body2' color='textSecondary' gutterBottom>
            Select an Excel file to bulk upload data into the system. Please
            ensure the file format follows the specified columns.
          </Typography>
          <ImportDataComponent />
        </SectionContainer>

        {/* Data Format Guide */}
        <SectionContainer>
          <Typography variant='h6' component='h2' gutterBottom>
            Data Format Guide
          </Typography>
          <Alert severity='warning' style={{ marginBottom: '16px' }}>
            Ensure your file does not contain duplicate entries, as this can
            cause import errors.
          </Alert>
          <Typography variant='body2' color='textSecondary' gutterBottom>
            Format your Excel file with the following columns, and do not repeat
            data entries:
          </Typography>
        </SectionContainer>
      </PaperContainer>
    </PageContainer>
  );
};

// Styled Components for layout and styling
const PageContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align items to the top for better spacing */
  padding: 40px 16px;
  min-height: 100vh;
  width: 100%;
  background-color: #f0f2f5; /* Background color for the whole page */
  box-sizing: border-box;
`;

const PaperContainer = styled(Paper)`
  padding: 32px;
  max-width: 800px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); /* Optional shadow for depth */
`;

const SectionContainer = styled(Box)`
  margin-top: 24px;
  padding: 16px 0;
`;

export default AddData;

// // AddData.jsx
// import React from 'react';
// import {
//   Typography,
//   Box,
//   Paper,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Alert,
// } from '@mui/material';
// import styled from 'styled-components';
// import ImportDataComponent from '../components/ImportDataComponent';

// const AddData = () => {
//   return (
//     <PageContainer>
//       <PaperContainer elevation={3}>
//         <Typography variant='h4' component='h1' gutterBottom>
//           Add Data
//         </Typography>
//         <Divider style={{ marginBottom: '24px' }} />

//         {/* Import Component */}
//         <SectionContainer>
//           <Typography variant='h6' component='h2' gutterBottom>
//             Import from Excel
//           </Typography>
//           <Typography variant='body2' color='textSecondary' gutterBottom>
//             Select an Excel file to bulk upload data into the system. Please
//             ensure the file format follows the specified columns.
//           </Typography>
//           <ImportDataComponent />
//         </SectionContainer>

//         {/* Data Format Guide */}
//         <SectionContainer>
//           <Typography variant='h6' component='h2' gutterBottom>
//             Data Format Guide
//           </Typography>
//           <Alert severity='warning' style={{ marginBottom: '16px' }}>
//             Ensure your file does not contain duplicate entries, as this can
//             cause import errors.
//           </Alert>
//           <Typography variant='body2' color='textSecondary' gutterBottom>
//             Format your Excel file with the following columns, and do not repeat
//             data entries:
//           </Typography>

//           {/* Table for data fields */}
//           <TableContainer
//             component={Box}
//             sx={{ maxHeight: 300, overflowY: 'auto' }}
//           >
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell style={{ fontWeight: 'bold' }}>Field</TableCell>
//                   <TableCell style={{ fontWeight: 'bold' }}>
//                     Description
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {dataFields.map(({ field, description }) => (
//                   <TableRow key={field}>
//                     <TableCell>{field}</TableCell>
//                     <TableCell>{description}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </SectionContainer>
//       </PaperContainer>
//     </PageContainer>
//   );
// };

// // Field descriptions based on schema
// const dataFields = [
//   {
//     field: "I'm Model/Photographer/MUA",
//     description: 'Role of the individual (e.g., Model, Photographer, MUA)',
//   },
//   {
//     field: 'Magazine',
//     description: 'Name of the magazine associated with the record',
//   },
//   {
//     field: 'Currency',
//     description: 'Currency type used for payment (e.g., USD)',
//   },
//   { field: 'Amount', description: 'Amount paid' },
//   { field: 'Status', description: 'Current status of the transaction' },
//   {
//     field: 'Payment Type',
//     description: 'Type of payment (e.g., Credit, Debit)',
//   },
//   {
//     field: 'Payment Method',
//     description: 'Method used for payment (e.g., PayPal)',
//   },
//   { field: 'First Name', description: 'First name of the individual' },
//   { field: 'Last Name', description: 'Last name of the individual' },
//   {
//     field: 'Country Code',
//     description: 'Country code associated with the phone number',
//   },
//   { field: 'Email', description: 'Primary email address' },
//   { field: 'Phone', description: 'Phone number' },
//   { field: 'Address', description: 'Street address' },
//   { field: 'State', description: 'State or province' },
//   { field: 'ZIP Code', description: 'Postal code' },
//   { field: 'Order ID', description: 'Unique order identifier' },
//   { field: 'Product', description: 'Product name' },
//   { field: 'Quantity', description: 'Quantity purchased' },
//   { field: 'Discount', description: 'Discount applied' },
//   { field: 'Shipping', description: 'Shipping cost' },
//   {
//     field: 'I Am model/photographer',
//     description: 'Whether the person is a model or photographer',
//   },
//   { field: 'MODEL: Stage Name', description: "Model's stage name" },
//   { field: 'Model Insta Link 1', description: "Link to model's Instagram" },
//   { field: 'Email Address', description: 'Additional email address' },
//   {
//     field: 'Photographer Insta Link 1',
//     description: "Link to photographer's Instagram",
//   },
//   { field: "MUA's : Stage Name", description: "MUA's stage name" },
//   { field: 'Mua Insta Link-', description: "Link to MUA's Instagram" },
//   { field: 'Phone number', description: 'Alternate phone number' },
//   { field: 'Country', description: 'Country of residence' },
//   {
//     field: 'Date of Birth',
//     description: 'Date of birth (formatted as YYYY-MM-DD)',
//   },
//   { field: 'Notes', description: 'Additional notes' },
// ];

// // Styled Components for layout and styling
// const PageContainer = styled(Box)`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 40px 16px;
//   min-height: 100vh;
//   width: 100%;
//   background-color: #f0f2f5;
//   box-sizing: border-box;
// `;

// const PaperContainer = styled(Paper)`
//   padding: 32px;
//   max-width: 800px;
//   width: 100%;
//   border-radius: 8px;
// `;

// const SectionContainer = styled(Box)`
//   margin-top: 24px;
//   padding: 16px 0;
// `;

// export default AddData;
