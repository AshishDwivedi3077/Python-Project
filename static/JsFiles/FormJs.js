$(document).ready(function(){
    page={'page':1}
    $( "#Showbtn" ).click(function() {
         $.ajax({
        url: 'LoadForm',
        type: "POST",
        data:page ,
        success: function(resp, textStatus, jqXHR) {
                  $('#formImg').attr('src', JSON.stringify(resp).slice(1,-1));

        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Error occurred!');
        }

        });
    });
 });



     function showGrid(dd)
            {
            var mydata = [
               { id: "1", Labels:"Name", question: "Name",answer: JSON.stringify(dd.Name)},
               { id: "2",Labels:"Company", question: "Company",answer: JSON.stringify(dd.Company)},
               { id: "3",Labels:"Employee Code",  question: "Employee Code",answer: JSON.stringify(dd['Employee Code'])},
               { id: "4",Labels:"answer1", question: JSON.stringify(dd.question1).slice(1, -1),answer: JSON.stringify(dd.answer1) },
               { id: "5",Labels:"answer2",  question: JSON.stringify(dd.question2).slice(1, -1),answer: JSON.stringify(dd.answer2)},
               { id: "6",Labels:"answer3",  question: JSON.stringify(dd.question3).slice(1, -1),answer: JSON.stringify(dd.answer3)},
               { id: "7",Labels:"answer4",  question: JSON.stringify(dd.question4).slice(1, -1),answer: JSON.stringify(dd.answer4)},
               { id: "8", Labels:"answer5", question: JSON.stringify(dd.question5).slice(1, -1),answer: JSON.stringify(dd.answer5)},
               { id: "9",Labels:"answer6",  question: JSON.stringify(dd.question6).slice(1, -1),answer: JSON.stringify(dd.answer6)},
               { id: "10", Labels:"answer7", question: JSON.stringify(dd.question7).slice(1, -1),answer: JSON.stringify(dd.answer7)},
               { id: "11",Labels:"answer8",  question: JSON.stringify(dd.question8).slice(1, -1),answer: JSON.stringify(dd.answer8)},
               { id: "12",Labels:"answer9",  question: JSON.stringify(dd.question9).slice(1, -1),answer: JSON.stringify(dd.answer9)},
               { id: "13",Labels:"answer10",  question: JSON.stringify(dd.question10).slice(1, -1),answer: JSON.stringify(dd.answer10)},
               { id: "14", Labels:"answer11", question: JSON.stringify(dd.question11).slice(1, -1),answer: JSON.stringify(dd.answer11)},
               { id: "15", Labels:"answer12", question: JSON.stringify(dd.question12).slice(1, -1),answer: JSON.stringify(dd.answer12)},
               { id: "17", Labels:"answer13", question: JSON.stringify(dd.question13).slice(1, -1),answer: JSON.stringify(dd.answer13)}]
        $('#jqGrid').jqGrid('clearGridData');

        $("#jqGrid").jqGrid('setGridParam', { data: mydata});

        $("#jqGrid").trigger('reloadGrid');

    $("#jqGrid").jqGrid({
        datatype: "local",
        data: mydata,
        pager: '#jqGridPager',
        colModel: [
                    { label: 'No', name: 'id', width: 10, key:true ,hidden:true},
                    { label: 'Labels', name: 'Labels', width: 20 ,editable: false,hidden:true},
                    { label: 'Question', name: 'question', width: 600 ,editable: false},
                    { label: 'Answer', name: 'answer', width: 100,align:'center',editable: true },
           {
               label: "Edit Actions",

                name: "actions",

                width: 80,


                formatter: "actions",

                search: false,

                sortable: false,

                formatoptions: {

                    keys: true,

                    editbutton: true,

                    // editOptions: {},

                    addOptions: {},

                    delbutton: false,

                    delOptions: {

                      //  url: getAPIURL() + "/Employees/DeleteShift",

                        beforeSubmit: function (postdata) {


                        },

                        onclickSubmit: function (params, Shiftdata) {



                        },

                        afterComplete: function (response, Shiftdata) {


                        }

                    },

                    afterSave: function (rowID, response) {
            var item = $(this).jqGrid("getLocalRow", rowID);
            UpdateJson(item)
                    },

                },

            }
      ],

        shrinkToFit: false,

        rowList: [20, 40, 65, 70],

        // sortname: "invid",

        sortorder: "desc",

        gridview: true,

        autoencode: true,

        caption: "Shift",
         cellEdit: false,

        cellsubmit: 'clientArray',

        editurl: 'clientArray',

        viewrecords: true,

        rowNum: 51,

        emptyrecords: 'No records to display',



        jsonReader: {

            root: "rows",

            page: "page",

            total: "total",

            records: "records",

            repeatitems: true

            // UserId: "0"

        },



    }).jqGrid("navGrid", "#jqGridPager",

        {

            edit: true,

            add: true,

            del: false,

            search: true,

            refresh: true



        }



    );
}

var count = 0;


function UpdateJson(data)
{
        data['count']=count;
       // alert(JSON.stringify(data))


    $.ajax({
    url: 'PostData',
    type: "POST",
    data: data,
    success: function(resp, textStatus, jqXHR) {
      //  alert('Success!' + JSON.stringify(resp));

    },
    error: function(jqXHR, textStatus, errorThrown) {
        alert('Error occurred!');
    }

    });
}


function UpdateForm(formNo)
{

    valu={'form': formNo }
            $.ajax({
        url: 'LoadForm',
        type: "POST",
        data:valu ,
        success: function(resp, textStatus, jqXHR) {
                 $('#formImg').attr('src', JSON.stringify(resp).slice(1,-1));

},
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Error occurred!');
        }

        });
}


$(document).ready(function(){

 $( "#nextBtn" ).click(function() {
    count++;
    UpdateGrid(count)
    
      $("#FormNoLbl").empty();
      $("#FormNoLbl").append(count + " of 200");
  });

  $( "#prevbtn" ).click(function() {


    if(count>1){
    count--;
         UpdateGrid(count)
        $("#FormNoLbl").empty();
        $("#FormNoLbl").append(count + " of 200");
      }
  });

$( "#savebtn" ).click(function() {

    Upload_to_blob(count)

  });

  });


function UpdateGrid(val)
{


    valu={'page': val}
            $.ajax({
        url: 'UpdateGrid',
        type: "POST",
        data:valu,
        success: function(resp, textStatus, jqXHR) {

                showGrid(resp)
                UpdateForm(val)
},
        error: function(jqXHR, textStatus, errorThrown) {
            alert('No more files!');
        }

        });
}

function Upload_to_blob(val)
{
    valu={'count': val}
            $.ajax({
        url: 'Uploadtoblob',
        type: "POST",
        data:valu,
        success: function(resp, textStatus, jqXHR) {
                alert(resp)
},
        error: function(jqXHR, textStatus, errorThrown) {
            alert('No more files!');
        }

        });
}

function BlobServiceGet1()
{
alert("1")

const accountName = "<Add your storage account name>";
const sasString = "https://checklistform.blob.core.windows.net/?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2020-08-07T17:22:05Z&st=2020-07-08T09:22:05Z&spr=https&sig=0r0Z5e1FIGwSXy%2FePEyl2vYQqHBhFKVRPxyCRRs7EXY%3D";
const containerName = "analyzed";
const containerURL = new azblob.ContainerURL('DefaultEndpointsProtocol=https;AccountName=checklistform;AccountKey=dpZeiTIELCgVGxRxqYkhqAx42b8pWND2onchJ83+yXgHqbkMkPS5aKbmmVMtdDJdENFmmH3EuHhANmUQ02d7TQ==;EndpointSuffix=core.windows.net')
//    `https://${accountName}.blob.core.windows.net/${containerName}?${sasString}`,
//    azblob.StorageURL.newPipeline(new azblob.AnonymousCredential));
alert("2")
const listFiles = async () => {
    fileList.size = 0;
    fileList.innerHTML = "";
    try {
           alert("3")
        reportStatus("Retrieving file list...");
        let marker = undefined;
        do {
        alert("4")
            const listBlobsResponse = await containerURL.listBlobFlatSegment(
                azblob.Aborter.none, marker);
            marker = listBlobsResponse.nextMarker;
            const items = listBlobsResponse.segment.blobItems;
            for (const blob of items) {
                fileList.size += 1;
                fileList.innerHTML += `<option>${blob.name}</option>`;
            }
        } while (marker);
        if (fileList.size > 0) {
            reportStatus("Done.");
        } else {
            reportStatus("The container does not contain any files.");
        }
    } catch (error) {
        reportStatus(error.body.message);
    }
};

}
function GetFilesBlob()
{




    //alert("successdsadsadsa dw")
    //data-get-url="/_services/entity-grid-data.json/f46b70cc-580b-4f1a-87c3-41deb48eb90d"
       $.ajax({
        url: 'Downloadblob',
        method: "GET",

        success: function(resp, textStatus, jqXHR) {
            alert("success")
},
        error: function(jqXHR, textStatus, errorThrown) {
            alert('No more files!');
        }

        });
}

