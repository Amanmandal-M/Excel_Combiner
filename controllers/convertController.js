const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

exports.convertData = async (req, res) => {
  try {
    // Retrieve uploaded files from req.files
    const uploadedFiles = req.files;

    // Check if any files were uploaded
    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new Error('No files uploaded.');
    }

    // Initialize an empty array to store sheet names and data
    let allData = [];

    // Loop through each uploaded file and read its data
    uploadedFiles.forEach(file => {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });

      // Assuming each file has only one sheet, you can modify this part if needed
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Add sheet name and data to the array
      allData.push({ sheetName, data: sheetData });
    });

    // Check if any data was read
    if (allData.length === 0) {
      throw new Error('No data found in the uploaded Excel files.');
    }

    // Merge data from all sheets into one array
    let mergedData = [];
    allData.forEach(sheet => {
      mergedData = mergedData.concat(sheet.data);
    });

    // Check if the mergedData array is empty
    if (mergedData.length === 0) {
      throw new Error('Merged data is empty. Check if the uploaded sheets have data.');
    }

    // Create a new workbook and sheet manually
    const mergedWorkbook = xlsx.utils.book_new();
    const sheetHeaders = Object.keys(mergedData[0]);
    const sheetValues = mergedData.map(item => Object.values(item));
    xlsx.utils.book_append_sheet(mergedWorkbook, xlsx.utils.aoa_to_sheet([sheetHeaders, ...sheetValues]), 'MergedData');

    // Check if the 'output' folder exists, and create it if not
    const outputFolderPath = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath);
    }

    // Save the workbook to a new Excel file in the 'output' folder
    const outputPath = path.join(outputFolderPath, 'combined_data.xlsx');
    await xlsx.writeFile(mergedWorkbook, outputPath);

    res.status(200).json({
      "Message": 'Merged data has been saved successfully.',
      "OutputPath": outputPath,
    });

  } catch (error) {
    console.log(`Error in Convert Data Controller: ${error.message}`);
    res.status(500).json({
      'Message': error.message,
      'Error': 'Internal Server Error',
    });
  }
};


exports.downloadingFilesData = async (req,res) => {
  try {
      const filePath = path.join(__dirname, '..', 'output', 'combined_data.xlsx');
      res.download(filePath);
  } catch (error) {
    console.log(`Error in Download Data Controller: ${error.message}`);
    res.status(500).json({
      'Message': error.message,
      'Error': 'Internal Server Error',
    });    
  }
}