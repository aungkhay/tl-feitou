import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const formattedDate = (date) => {
    if (!date) return ''

    const d = new Date(date)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')

    const str = `${y}年${m}月${day}日`;
    return str;
}

export const exportExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${filename}.xlsx`);
}

export const checkResult = (result) => {
    switch (result) {
        case 1:
            return '庄';
            break;
        case 2:
            return '闲';
            break;
        case 4:
            return '和';
            break;
        case 8:
            return '庄对';
            break;
        case 16:
            return '闲对';
            break;
        case 32:
            return '幸运6_2';
            break;
        case 64:
            return '幸运6_3';
            break;
        case 128:
            return '完美';
            break;
        case 256:
            return '任意对';
            break;
    
        default:
            return '';
            break;
    }
}