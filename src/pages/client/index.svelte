<script>
    import { metatags } from '@roxi/routify';
    metatags.title = 'Dashboard - Buzzstrike';
    metatags.description = 'Buzzstrike Dashboard';
    
    import {loading} from '../_store';
    import { onMount, onDestroy } from 'svelte';
    import Circle from './_components/Circle.svelte';
    import TableMessage from './_components/TableMessage.svelte';
    import { Datemi } from '../../parsemi';
    import Dashboard from '../../services/Dashboard'
    import 'jspdf-autotable';
    import {Report} from '../../helper';
    
    let totalData = { 'total': 0, 'sent': 0, 'delivery': 0, 'answered': 0, 'unanswered': 0 };
    let totalPercent = { 'total': 0, 'sent': 0, 'delivery': 0, 'answered': 0, 'unanswered': 0 };

    let startDate = Datemi.todayFirst();
    let endDate = Datemi.todayLast();

    let isFetching = false;
    let isPending = false;
    let subs = null;

    let message = {
        sent: [],
        answered: [],
        unanswered: []
    }

    async function fetchAllFeatures() {
        isFetching = true;
        const broad = await Dashboard.getBroadcast(startDate, endDate);
        const sent = await Dashboard.getSent(startDate, endDate);
        const delivery = await Dashboard.getDelivery(startDate, endDate);
        const answered = await Dashboard.getAnswered(startDate, endDate);
        const unanswered = await Dashboard.getUnAnswered(startDate, endDate);
        let broadTotal = 0;
        broad.map((item)=>{
            const rc = item.get('receiveCount');
            broadTotal += rc ? rc : 0;
            console.log(rc);
        });
        const data = {
            total: broadTotal,
            sent: sent ? sent.count : 0,
            delivery: delivery ? delivery.count : 0,
            answered: answered ? answered.count : 0,
            unanswered: unanswered ? unanswered.count : 0
        }
        const results = {
            sent: sent ? sent.results.map(d=>d.toJSON()) : [],
            answered: answered ? answered.results.map(d=>d.toJSON()) : [],
            unanswered: unanswered ? unanswered.results.map(d=>d.toJSON()) : [],
        }
        totalData = data;
        message = results;
        calculate(data);
        isFetching = false;
    }

    function onTriggered() {
        if(isPending) return;
        if(isFetching) {
            isPending = true;
            setTimeout(() => {
                fetchAllFeatures();
                isPending = false;
            }, 5000);
        } else {
            fetchAllFeatures();
        }
    }

    onMount(async ()=>{
        isFetching = true;
        await fetchAllFeatures();
        loading.set(false);
        subs = await Dashboard.subscribe();
        subs.on('create', onTriggered);
        subs.on('update', onTriggered);
    });

    onDestroy(()=>{
        if(subs){
            subs.unsubscribe();
        }
    });

    function calculate(data) {
        totalPercent = {
            total: data.total,
            sent: percent(data.sent, data.total),
            delivery: percent(data.delivery, data.total),
            answered: percent(data.answered, data.total),
            unanswered: percent(data.unanswered, data.total)
        }
    }

    function percent(t, b) {
        if(b == 0) return 0;
        return Math.round((t / b * 100 * 100), 2) / 100;
    }
    
    function report() {
        loading.set(true);
        // let sent = await Dashboard.getSent(startDate, endDate, 20);
        // let contact = await Contact.get(20);
        // contact = contact ? contact.map(d=>d.toJSON()) : [];
        // convert and add contact
        // sent = sent ? sent.results.map((d)=>{
        //     d = d.toJSON();
        //     let c = contact.filter(c=>('62' + c.number + '@c.us') == d.to);
        //     d.contact = c && c.length > 0 ? c[0].name : null;
        //     return d;
        // }) : [];
        getImageFromUrl("/images/logo.png", async (d)=>{
            // generatePDF(d, sent);
            // await Report.generate(startDate, endDate, d, totalData);
            await Report.generateXLSX(startDate, endDate, d, totalData);
            loading.set(false);
        });
    }

    function getImageFromUrl(url, callback) {
      var img = new Image();
      img.onError = function() {
          alert('Cannot load image: "'+url+'"');
      };
      img.onload = function() {
          callback(img);
      };
      img.src = url;
    }

    // async function generatePDF(imgData, message=[]) {
    //     const doc = new jsPDF();
    //     var finalY = 20;
    //     doc.addImage(imgData, 'PNG', 15, finalY, 50, 10);
    //     finalY += 20;
    //     doc.text(15, finalY, ('Laporan ' + Datemi.hDate(null, true)));
    //     finalY += 5;

    //     const style = {fillColor: [57, 128, 59]};

    //     doc.autoTable({
    //         startY: finalY,
    //         headStyles: style,
    //         head: [['Ringkasan', 'Total']],
    //         body: [
    //         ['Pesan Terkirim', totalData.sent],
    //         ['Pesan Diterima', totalData.delivery],
    //         ['Pesan Terbalas', totalData.answered],
    //         ['Pesan Tidak Terbalas', totalData.unanswered],
    //         ['Total Broadcast', totalData.total],
    //         ['Tingkat Konversi Pesan', percent(totalData.answered, totalData.sent)+'%'],
    //         // ...
    //         ],
    //     });
    //     finalY = doc.lastAutoTable.finalY || 20;
    //     finalY += 15;
    //     doc.text(15, finalY, 'Detail Pesan');
    //     finalY += 7;

    //     // START dynamic here

    //     doc.setFontSize(10);
    //     doc.text(15, finalY, 'Isi Pesan:');
    //     finalY += 5;
    //     let msg = message.length > 0 ? message[0].body : "";
    //     msg = msg.length > 100 ? msg.substr(0, 100) + "..." : msg;
    //     doc.text(15, finalY, msg);
    //     finalY += 7;

    //     // REORDER
    //     let printM = message;
    //     printM.sort((a,b)=>{
    //         return b.ack > a.ack ? 1 : -1;
            
    //     });
    //     let orderM = [];
    //     let failedM = [];
    //     for(let i = 0; i < printM.length; i++) {
    //         if(printM[i].ack == 0) {
    //         failedM.push(printM[i]);
    //         } else {
    //         orderM.push(printM[i]);
    //         }
    //     }
    //     failedM.map(x=>orderM.push(x));

    //     // FILTER DUPLICATE NUMBER
    //     // first reverse the array
    //     let reverseOrderM = orderM.reverse();
    //     let ids = reverseOrderM.map(o => o.to);
    //     let filtered = reverseOrderM.filter(({to}, index) => !ids.includes(to, index+1));
    //     let reverseBackFiltered = filtered.reverse();

    //     doc.autoTable({
    //         startY: finalY,
    //         headStyles: style,
    //         // columnStyles: { europe: { halign: 'center' } }, // European countries centered
    //         // body: this.messages,
    //         // body: orderM,
    //         // body: filtered,
    //         body: reverseBackFiltered,
    //         columns: [
    //         //   { header: 'Penerima', dataKey: 'first_name' },
    //         { header: 'Penerima', dataKey: 'contact' },
    //         { header: 'Nomor', dataKey: 'to' },
    //         { header: 'Status', dataKey: 'ack' },
    //         { header: 'Terbalas', dataKey: 'isReplied' }
    //         ],
    //         didParseCell: function (data) {
    //         if(data.row.raw.isReplied && data.cell.section == "body") {
    //             data.cell.styles.fillColor = [166, 255, 167]
    //         }

    //         // rename cell text
    //         if(data.column.dataKey == "isReplied" && data.cell.section == "body") {
    //             if(data.cell.raw) {
    //                 data.cell.text = ['Ya'];
    //             } else {
    //                 data.cell.text = ['Tidak'];
    //             }
    //         }

    //         if(data.column.dataKey == "to" && data.cell.section == "body") {
    //             const s = data.cell.raw.split('@');
    //             data.cell.text = [s[0]];
    //         }

    //         if(data.column.dataKey == "ack" && data.cell.section == "body") {
    //             if(data.cell.raw == 1) {
    //                 data.cell.text = ['Terkirim'];
    //             } else if(data.cell.raw == 2) {
    //                 data.cell.text = ['Tersampaikan'];
    //             } else if(data.cell.raw == 3) {
    //                 data.cell.text = ['Terbaca'];
    //             } else if(data.cell.raw == 0){
    //                 data.cell.text = ['Server'];
    //             } else if(data.cell.raw <= 0){
    //                 data.cell.text = ['Gagal'];
    //             } else {
    //                 data.cell.text = ['Tak terdefinisi'];
    //             }
    //         }
    //         }
    //     });
    //     finalY = doc.lastAutoTable.finalY;

    //     doc.save("buzzstrike-report.pdf");
    //     loading.set(false);
    // }
</script>

<div id="main area" class="flex w-full overflow-hidden">
    <div class="left w-full min-h-full" >
        <div class="flex content bg-white rounded-2xl sm:p-6 mx-3 mt-6" >
            <div class="grid justify-items-center relative h- w-9/12">
                <div class="w-full">
                    <select id="country" name="country" autocomplete="country" class=" block w-28 h-10 p-2 border border-gray-500 bg-white rounded-full shadow-sm focus:outline-none focus:ring-gray-300 focus:border-gray-300 sm:text-sm text-gray-500 font-extrabold" disabled>
                      <option>Hari ini</option>
                      <option>Bulan</option>
                      <option>Tahun</option>
                    </select>
                </div>
                <div class="mr-8 pt-6 grid grid-flow-col grid-rows-1 gap-8 h-60">
                    <Circle title="TERKIRIM" total={totalData.sent} percent={totalPercent.sent} color="#F87171" />
                    <Circle title="DITERIMA" total={totalData.delivery} percent={totalPercent.delivery} color="#41A742" />
                    <Circle title="TERBALAS" total={totalData.answered} percent={totalPercent.answered} color="#312E81" />
                    <Circle title="TIDAK TERBALAS" total={totalData.sent - totalData.answered} percent={totalPercent.unanswered} color="#FBBF24" />
                </div>
                <button on:click={report} class="cursor-pointer bg-green-500 py-3 px-10  rounded-full my-1 bg-transparent flex items-center transform hover:scale-105 motion-reduce:transform-none duration-200 ">
                    <div class="list-icon mr-1 inline-block">
                        <svg class="w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                    </div>
                    <div class="inline-block font-normal text-white">Unduh Laporan</div>
                </button>
            </div>
            <div class="sm:p-4 grid grid-cols-1 gap-2 h-full w-full">
                <div class="place-self-auto  bg-green-500 w-full  rounded-2xl pb-3 mb-3">
                    <h1 class="text-white text-2xl text-center pt-5">Total Broadcast</h1>
                    <h1 class="text-white text-6xl text-center">{totalData.total}</h1>
                </div>
                <div class="place-self-auto  bg-green-500 w-full rounded-2xl pb-3">
                    <h1 class="pt-5 text-2xl text-white text-center">Tingkat Konversi<br>Pesan</h1>
                    <h1 class="text-white text-6xl text-center">{percent(totalData.answered, totalData.sent)}%</h1>
                </div>
            </div>
        </div>
        <div class="py-6 px-3 grid grid-flow-col grid-cols-3 grid-rows-1 gap-2">
            <TableMessage data={message.sent} title="Pesan Terkirim" color="bg-red-500" />
            <TableMessage data={message.answered} title="Pesan Terbalas" color="bg-indigo-800" />
            <TableMessage data={message.unanswered} title="Pesan Tidak Terbalas" color="bg-yellow-500" />
        </div>
    </div> 
</div>