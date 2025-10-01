import Papa from 'papaparse';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export type FileFormat = 'json' | 'csv' | 'xml';

export interface ConversionError {
  message: string;
  line?: number;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: true,
});

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
  indentBy: '  ',
});

// Validate and parse JSON
export function parseJSON(content: string): { data?: any; error?: ConversionError } {
  try {
    const data = JSON.parse(content);
    return { data };
  } catch (err: any) {
    return {
      error: {
        message: `Invalid JSON: ${err.message}`,
      },
    };
  }
}

// Validate and parse CSV
export function parseCSV(content: string): { data?: any; error?: ConversionError } {
  try {
    const result = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (result.errors.length > 0) {
      return {
        error: {
          message: `CSV Error: ${result.errors[0].message}`,
          line: result.errors[0].row,
        },
      };
    }

    return { data: result.data };
  } catch (err: any) {
    return {
      error: {
        message: `Invalid CSV: ${err.message}`,
      },
    };
  }
}

// Validate and parse XML
export function parseXML(content: string): { data?: any; error?: ConversionError } {
  try {
    const data = xmlParser.parse(content);
    return { data };
  } catch (err: any) {
    return {
      error: {
        message: `Invalid XML: ${err.message}`,
      },
    };
  }
}

// Convert JSON to CSV
export function jsonToCSV(data: any): string {
  if (Array.isArray(data)) {
    return Papa.unparse(data);
  } else if (typeof data === 'object') {
    return Papa.unparse([data]);
  }
  throw new Error('JSON must be an object or array');
}

// Convert JSON to XML
export function jsonToXML(data: any): string {
  const wrapped = { root: data };
  return xmlBuilder.build(wrapped);
}

// Convert CSV to JSON
export function csvToJSON(data: any): string {
  return JSON.stringify(data, null, 2);
}

// Convert CSV to XML
export function csvToXML(data: any): string {
  const wrapped = { root: { item: data } };
  return xmlBuilder.build(wrapped);
}

// Convert XML to JSON
export function xmlToJSON(data: any): string {
  return JSON.stringify(data, null, 2);
}

// Convert XML to CSV
export function xmlToCSV(data: any): string {
  // Try to find an array in the XML data
  let arrayData = null;

  const findArray = (obj: any): any => {
    if (Array.isArray(obj)) return obj;
    if (typeof obj === 'object') {
      for (const key in obj) {
        const result = findArray(obj[key]);
        if (result) return result;
      }
    }
    return null;
  };

  arrayData = findArray(data);

  if (!arrayData) {
    // If no array found, convert the object itself
    arrayData = [data];
  }

  return Papa.unparse(arrayData);
}

// Main conversion function
export function convertFile(
  content: string,
  fromFormat: FileFormat,
  toFormat: FileFormat
): { result?: string; error?: ConversionError } {
  if (fromFormat === toFormat) {
    return { result: content };
  }

  try {
    // Parse the input
    let parsedData: any;
    let parseResult;

    switch (fromFormat) {
      case 'json':
        parseResult = parseJSON(content);
        if (parseResult.error) return { error: parseResult.error };
        parsedData = parseResult.data;
        break;
      case 'csv':
        parseResult = parseCSV(content);
        if (parseResult.error) return { error: parseResult.error };
        parsedData = parseResult.data;
        break;
      case 'xml':
        parseResult = parseXML(content);
        if (parseResult.error) return { error: parseResult.error };
        parsedData = parseResult.data;
        break;
    }

    // Convert to target format
    let result: string;
    switch (toFormat) {
      case 'json':
        result = fromFormat === 'csv' ? csvToJSON(parsedData) : xmlToJSON(parsedData);
        break;
      case 'csv':
        result = fromFormat === 'json' ? jsonToCSV(parsedData) : xmlToCSV(parsedData);
        break;
      case 'xml':
        result = fromFormat === 'json' ? jsonToXML(parsedData) : csvToXML(parsedData);
        break;
    }

    return { result };
  } catch (err: any) {
    return {
      error: {
        message: `Conversion error: ${err.message}`,
      },
    };
  }
}
