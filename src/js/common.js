import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import moment from 'moment'

export const formattedDate = (date, time) => {
    if (!date) return ''

    const d = time ? moment(date).format('YYYY-MM-DD') + ' ' + time : moment(date).format('YYYY-MM-DD');
    const y = moment(d).year()
    const m = moment(d).month() + 1
    const day = moment(d).date()
    const h = moment(d).hour()
    const min = moment(d).minute()
    const s = moment(d).second()

    let dateTimeStr = `${y}-${m.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    if (time) {
        dateTimeStr += ` ${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    return dateTimeStr;
}

export const exportExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${filename}.xlsx`);
}

export const checkResult_ = (result) => {
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

export const checkResult = (code) => {
    const map = [
        [1, '庄赢'],
        [2, '闲赢'],
        [4, '和'],
        [8, '庄对'],
        [16, '闲对'],
        [32, '幸运6_2'],
        [64, '幸运6_3'],
        [128, '完美'],
        [256, '任意对']
    ];

    return map
        .filter(([value]) => (code & value) === value)
        .map(([, name]) => name)
        .join(' ');
}