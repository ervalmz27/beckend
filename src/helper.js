import jsPDF from 'jspdf';
import { Datemi } from './parsemi';
import Contact from './services/Contact';
import Broadcast from './services/Broadcast';
import XLSX from "xlsx";

export const Report = {
    percent: (t, b) => {
        if(b == 0) return 0;
        return Math.round((t / b * 100 * 100), 2) / 100;
    },
    dynamicDetail: (doc, finalY, broadcastItem, style) => {
        let message = broadcastItem.messageList;
        doc.setFontSize(12);
        doc.text(15, finalY, broadcastItem.hashtag + " - " + broadcastItem.title);
        finalY += 5;
        doc.setFontSize(10);
        doc.text(15, finalY, 'Isi Pesan:');
        finalY += 5;
        let msg = message.length > 0 ? message[0].body : "";
        msg = msg.length > 100 ? msg.substr(0, 100) + "..." : msg;
        doc.text(15, finalY, msg);
        finalY += 5;

        // // REORDER
        let printM = message;
        // printM.sort((a,b)=>{
        //     return b.ack > a.ack ? 1 : -1; 
        // });
        let orderM = [];
        let failedM = [];
        for(let i = 0; i < printM.length; i++) {
            if(printM[i].ack == 0) {
            failedM.push(printM[i]);
            } else {
            orderM.push(printM[i]);
            }
        }
        failedM.map(x=>orderM.push(x));

        // // FILTER DUPLICATE NUMBER
        // // first reverse the array
        let reverseOrderM = orderM.reverse();
        let ids = reverseOrderM.map(o => o.to);
        let filtered = reverseOrderM.filter(({to}, index) => !ids.includes(to, index+1));
        let reverseBackFiltered = filtered.reverse();

        doc.autoTable({
            startY: finalY,
            headStyles: style,
            body: reverseBackFiltered,
            columns: [
            { header: 'Penerima', dataKey: 'contact' },
            { header: 'Nomor', dataKey: 'to' },
            { header: 'Status', dataKey: 'ack' },
            { header: 'Terbalas', dataKey: 'isReplied' }
            ],
            didParseCell: function (data) {
                if(data.row.raw.isReplied && data.cell.section == "body") {
                    data.cell.styles.fillColor = [166, 255, 167]
                }

                // rename cell text
                if(data.column.dataKey == "isReplied" && data.cell.section == "body") {
                    if(data.cell.raw) {
                        data.cell.text = ['Ya'];
                    } else {
                        data.cell.text = ['Tidak'];
                    }
                }

                if(data.column.dataKey == "to" && data.cell.section == "body") {
                    const s = data.cell.raw.split('@');
                    data.cell.text = [s[0]];
                }

                if(data.column.dataKey == "ack" && data.cell.section == "body") {
                    if(data.cell.raw == 1) {
                        data.cell.text = ['Terkirim'];
                    } else if(data.cell.raw == 2) {
                        data.cell.text = ['Tersampaikan'];
                    } else if(data.cell.raw == 3) {
                        data.cell.text = ['Terbaca'];
                    } else if(data.cell.raw == 0){
                        data.cell.text = ['Server'];
                    } else if(data.cell.raw <= 0){
                        data.cell.text = ['Gagal'];
                    } else {
                        data.cell.text = ['Tak terdefinisi'];
                    }
                }
            }
        });
        finalY = doc.lastAutoTable.finalY;
        return finalY + 8;

    },
    generate: async (startDate, endDate, imgData, totalData) => {
        const doc = new jsPDF();
        var finalY = 20;
        doc.addImage(imgData, 'PNG', 15, finalY, 50, 10);
        finalY += 20;
        doc.text(15, finalY, ('Laporan ' + Datemi.hDate(null, true)));
        finalY += 5;

        const style = {fillColor: [57, 128, 59]};

        doc.autoTable({
            startY: finalY,
            headStyles: style,
            head: [['Ringkasan', 'Total']],
            body: [
            ['Pesan Terkirim', totalData.sent],
            ['Pesan Diterima', totalData.delivery],
            ['Pesan Terbalas', totalData.answered],
            ['Pesan Tidak Terbalas', totalData.unanswered],
            ['Total Broadcast', totalData.total],
            ['Tingkat Konversi Pesan', Report.percent(totalData.answered, totalData.sent)+'%'],
            // ...
            ],
        });
        finalY = doc.lastAutoTable.finalY || 20;
        finalY += 15;
        doc.text(15, finalY, 'Detail Pesan');
        finalY += 7;

        // get contact for full name
        let contact = await Contact.get(20);
        contact = contact ? contact.map(d=>d.toJSON()) : [];
        // get broadcast for title
        let broadcast = await Broadcast.get(startDate, endDate, 100);
        let broadcastList = [];
        for(const broad of broadcast) {
            let bj = broad.toJSON();
            const hashtag = bj.hashtag;
            const m = await Broadcast.message(startDate, endDate, 20, hashtag);
            let mc = m.map(d=>{
                d = d.toJSON();
                let c = contact.filter(c=>('62' + c.number + '@c.us') == d.to);
                d.contact = c && c.length > 0 ? c[0].name : null;
                return d;
            });
            bj.messageList = mc;
            broadcastList.push(bj);
        }

        // START dynamic here
        if(broadcastList.length > 0) {
            for(const item of broadcastList) {
                finalY = Report.dynamicDetail(doc, finalY, item, style);
            }
        }

        doc.save("buzzstrike-report.pdf");
    },
    extract: (type, data) => {
        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        if(type == "label") {
            if(data && data.length > 0) {
                return data[0].name;
            }
        } else if(type == 'date') {
            let date = new Date(data);
            return `${date.getDate()}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`;
        } else if(type == 'time') {
            let time = new Date(data);
            return time.getHours() + ":" + time.getMinutes();
        } else if(type == 'phone') {
            const splt = data.split("@");
            return splt[0];
        } else if(type == 'status') {
            if(data == 1) {
                return 'Terkirim';
            } else if(data == 2) {
                return 'Tersampaikan';
            } else if(data == 3) {
                return 'Terbaca';
            } else if(data == 0){
                return 'Server';
            } else if(data <= 0){
                return 'Gagal';
            } else {
                return 'Tak terdefinisi';
            }
        }
        return null;
    },
    generateXLSX: async (startDate, endDate, imgData, totalData) => {
        let contact = await Contact.get(20);
        contact = contact ? contact.map(d=>d.toJSON()) : [];
        // get broadcast for title
        let broadcast = await Broadcast.get(startDate, endDate, 100);

        let messageList = [];

        for(const broad of broadcast) {
            let bj = broad.toJSON();
            const hashtag = bj.hashtag;
            const m = await Broadcast.message(startDate, endDate, 20, hashtag);
            let mc = m.map(d=>{
                d = d.toJSON();
                let c = contact.filter(c=>('62' + c.number + '@c.us') == d.to);
                d.contact = c && c.length > 0 ? c[0].name : null;
                const message = {
                    campaign: Report.extract('label', bj.labels), subject: bj.title, date: Report.extract('date', d.createdAt), time: Report.extract('time', d.createdAt), contact: d.contact, phone: Report.extract('phone', d.to), status: Report.extract('status', d.ack), reply: d.isReplied ? "Ya" : "Tidak"
                }
                messageList.push(message);
                // return d;
            });
            // bj.messageList = mc;
            // broadcastList.push(bj);
        }
        Report.saveToXlsx(totalData, messageList);
    },
    saveToXlsx: (totalData, messageList) => {
        const filename = "Buzzstrike - report.xlsx";
        const title = ["Buzzstrike Report", new Date()];
        
        const summary = [
            ['Pesan Terkirim', totalData.sent],
            ['Pesan Diterima', totalData.delivery],
            ['Pesan Terbalas', totalData.answered],
            ['Pesan Tidak Terbalas', totalData.unanswered],
            ['Total Broadcast', totalData.total],
            ['Tingkat Konversi Pesan', Report.percent(totalData.answered, totalData.sent)+'%']
        ];

        const cols = ["Campaign", "Subject", "Sent Date", "Sent Time", "Contact", "Phone Number", "Status", "Reply"];

        let prints = [];
        prints.push(title);
        prints.push([]);
        prints = prints.concat(summary);
        prints.push([]);
        prints.push(cols);
        for(const message of messageList) {
            const m = [message.campaign, message.subject, message.date, message.time, message.contact, message.phone, message.status, message.reply];
            prints.push(m);
        }

        var ws_name = "SheetJS";

        let wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(prints);

        XLSX.utils.book_append_sheet(wb, ws, ws_name);

        XLSX.writeFile(wb, filename);
    }
}