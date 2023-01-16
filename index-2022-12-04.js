(function() {

  // var jsonData = [{
  //     id: 1,
  //     pids: [2],
  //     gender: "male",
  //     name: "Asen",
  //     fullname: "Hari Seanli",
  //     ptags: "pegawe, anak pak angga",
  //     photo: "https://scontent.fdps5-1.fna.fbcdn.net/v/t31.18172-1/965793_4711714841239_1838817940_o.jpg?stp=c53.0.320.320a_dst-jpg_p320x320&_nc_cat=101&ccb=1-7&_nc_sid=7206a8&_nc_eui2=AeHK6dkyfnJngNhupWEqG30YVqGvClDTyJhWoa8KUNPImGIzcdKqYOh4Le51-RNFww0&_nc_ohc=T4nH2aZ90OgAX_nVdze&_nc_ht=scontent.fdps5-1.fna&oh=00_AfDdGFjJWHvN_NupL4O31nT700hNr4jFQQGmOdrJG7GT0g&oe=639300B7"
  //   },
  //   {
  //     id: 2,
  //     pids: [1],
  //     gender: "female",
  //     name: "Dewi",
  //     fullname: "Sridewi",
  //   },
  //   {
  //     id: 3,
  //     mid: 1,
  //     fid: 2,
  //     gender: "female",
  //     name: "Devita"
  //   }
  // ];
  var jsonData = [{
      id: 1,
      pids: [2],
      gender: "male",
      name: "Asen",
      fullname: "Hari Seanli",
      ptags: "pegawe, anak pak angga",
      photo: ""
    }
  ];

  function reload_data_family(obj_family, status = "load"){
    var jsonData = [];
    var data = {
        'id': 1,
        // 'ajaxAction':'select_data_by_id',
        'ajaxAction':'select_data_all',
      }
      var j_ajax = $.post("index.php", data, function(response) {
        console.log(response);
        obj_family.load(response);
        if(status == "load"){
          obj_family.load(response);
        }
        if(status == "update"){
          obj_family.update(response);
        }
        console.log(obj_family);
      }, "json");
      j_ajax.fail(function(data) {
        console.log(data);
      });
      
  }

  function check_property(v_obj, v_key, v_return){
    if(v_obj.hasOwnProperty(v_key)){
      return v_obj[v_key];
    }
    return v_return;
  }

  var editForm = function() {
    this.nodeId = null;
  };

  async function save_data_n(data, reload_status = false, _callback){
    console.log(data);
    return j_ajax = $.post("index.php", data, function(response) {
      if(reload_status == "reload"){
        reload_data_family(family, "update");  
      }
      return response;
    }, "json");

    // j_ajax.fail(function(data) {
    //   console.log("fail data");
    //   console.log(data);
    //   return data;
    // });
  }




  editForm.prototype.init = function(obj) {
    var that = this;
    this.obj = obj;
    this.crudform_id = document.querySelector("#frm_fam_id");
    this.crudform_id_tree = document.querySelector("#frm_fam_id_tree");
    this.crudform_name = document.querySelector("#frm_fam_name");
    this.crudform_namefull = document.querySelector("#frm_fam_fullname");
    this.crudform_gender = document.querySelector("#frm_gender");
    this.crudform_child = document.querySelector("#frm_fam_child");

    this.crudform_btn_cancel = document.querySelector("#crud_table input[value='Cancel']");
    this.crudform_btn_save = document.querySelector("#modal_form_family #save_frm_fam");
    this.modal_form_family = new bootstrap.Modal(document.getElementById('modal_form_family'));
    

    this.crudform_btn_save.addEventListener("click", function() {
        var id = $("#frm_fam_id").val(),
            id_tree = $("#frm_fam_id_tree").val(),
            nama = $("#frm_fam_name").val(),
            nama_full = $("#frm_fam_fullname").val(),
            gender = $("#frm_gender").val(),
            partner = $("#frm_fam_partner").val(),
            parent_m = $("#frm_fam_parent1").val(),
            parent_f = $("#frm_fam_parent2").val(),
            id_child = $("#frm_fam_child").val();

        if(Array.isArray(partner) == false){
          partner = "";
        }
        var data = {
          'id': id,
          'nama':nama,
          'nama_full':nama_full,
          'gender':gender,
          'partner':partner.toString(),
          'parent_m':parent_m,
          'parent_f':parent_f,
          'ajaxAction':'save_data_family',
        }

        //SAVE OR UPDATE DATA 
        save_data_n(data).then(
          function(value) {
            console.log(value);

            
            // IF HAVE CHILD ------------------
            console.log("id_child "+id_child);
            if(id_child != ""){
              var node_child = family.get(id_child);
              var node_parent = family.get(id_tree);
              var parent_gender =  node_parent.gender;
              var fid = check_property(node_child, "fid", "");
              var mid = check_property(node_child, "mid", "");
              if(parent_gender=="male"){
                fid = value.new_id;
              }
              if(parent_gender=="female"){
                mid = value.new_id;
              }
              var data_child = {
                'id': check_property(node_child, "id_db", ""),
                'nama':check_property(node_child, "name", ""),
                'nama_full':check_property(node_child, "fullname", ""),
                'gender':check_property(node_child, "gender", ""),
                'partner':check_property(node_child, "pids", "[]").toString(),
                'parent_m':mid,
                'parent_f':fid,
                'ajaxAction':'save_data_family',
              }
              save_data_n(data_child, "reload").then(
                function(value_child) {
                  console.log(value_child);
                },
                function(error_child) {
                  console.log(error_child);
                }
              )
              
            }
            // IF HAVE CHILD END------------------


          },
          function(error) {
            console.log(error);
          }
        );

        




        // var j_ajax = $.post("index.php", data, function(response) {
        //   reload_data_family(family, "update");
        // }, "json");

        // j_ajax.fail(function(data) {
        //   console.log(data);
        // });
    

      
    });
  };

  function reset_form(){
    var id_el = $("#frm_fam_id"),
        id_tree = $("#frm_fam_id_tree"),
        nama_el = $("#frm_fam_name"),
        nama_full_el = $("#frm_fam_fullname"),
        gender_el = $("#frm_gender"),
        partner_el = $("#frm_fam_partner"),
        parent_m_el = $("#frm_fam_parent1"),
        parent_f_el = $("#frm_fam_parent2");
        parent_ch = $("#frm_child");

    id_el.val("");
    id_tree.val("");
    nama_el.val("");
    nama_full_el.val("");
    gender_el.val("");
    partner_el.empty();
    parent_m_el.empty();
    parent_f_el.empty();
    parent_ch.val("");

  }


  function select_el_add_data(arr_ids, select_el){
    var str_ids = arr_ids.toString();
    console.log(arr_ids);
    var data = {
      'ids': str_ids,
      'ajaxAction':'select_data_by_id2',
    }
    var j_ajax = $.post("index.php", data, function(response) {
      // console.log("select_data_by_id2");
      console.log(response);
      $.each(response, function( index, value ) {
        var option = new Option(value.name, value.id, true, true);
        $(select_el).append(option).trigger('change');
      });
      
      $(select_el).trigger({
        type: 'select2:select',
        params: {
          data: arr_ids,
        }
      });
      
    }, "json");
    j_ajax.fail(function(data) {
      console.log(data);
    });
  }

  // function search_data_by_id(arr_ids){
  //   var str_ids = arr_ids.toString();
  //   console.log(arr_ids);
  //   var data = {
  //     'ids': str_ids,
  //     'ajaxAction':'select_data_by_id2',
  //   }
  //   var j_ajax = $.post("index.php", data, function(response) {
  //     console.log("select_data_by_id2");
  //     console.log(response);
      
  //   }, "json");
  //   j_ajax.fail(function(data) {
  //     console.log(data);
  //     console.log("sxx")
  //   });
  // }

  editForm.prototype.show = function(nodeId) {
    // this.hide();

    this.nodeId = nodeId;
    var node = family.get(nodeId);
    console.log("node");
    console.log(node);
    //xxxx2
    this.modal_form_family.show();
    reset_form();
    if(node.id){
      this.crudform_id.value = check_property(node, "id_db", "");
      this.crudform_id_tree.value = check_property(node, "id", "");
      this.crudform_name.value = check_property(node, "name", "");
      this.crudform_namefull.value = check_property(node, "fullname", "");
      this.crudform_gender.value = check_property(node,"gender", "");
      this.crudform_child.value = check_property(node, "id_child", "");
      
      var ids_partner = check_property(node, "pids", false);
      var id_parent_m = check_property(node, "mid", false);
      var id_parent_f = check_property(node, "fid", false);
      
      if(ids_partner){
        select_el_add_data(ids_partner, "#frm_fam_partner");
      }  
      if(id_parent_m){
        select_el_add_data(id_parent_m, "#frm_fam_parent1");
      }  
      if(id_parent_f){
        select_el_add_data(id_parent_f, "#frm_fam_parent2");
      }  
    }

  };
  
  editForm.prototype.hide = function(showldUpdateTheNode) {
    // this.editForm.style.display = "none";
  };
  
  var family = new FamilyTree(document.getElementById("tree"), {
    mouseScrool: FamilyTree.action.none,
    nodeBinding: {
      field_0: "name",
      img_0: "photo"
    },
    editUI: new editForm(),
    nodeTreeMenu: true,
    // editForm: {
    //   buttons: {
    //     pdf: null,
    //     share: null,
    //   },
    //   photoBinding: "photo",
    //   generateElementsFromFields: false,
    //   elements: [
    //     { type: 'textbox', label: 'Name', binding: 'name'},
    //     { type: 'textbox', label: 'Full Name', binding: 'fullname'},
    //     { type: 'select', label: 'Gender', binding: 'gender',
    //       options: [
    //         {value: 'male', text: 'Male'},
    //         {value: 'female', text: 'Female'}
    //       ], 
    //     },
    //     { type: 'textbox', label: 'Tag', binding: 'ptags'},
    //   ]
    // }
  });

  function save_new_families(nodes){
    
  }
  function process_new_data(nodes, counter){
    if(nodes){
      nodes.forEach(function(item, index) {
        // console.log("item");
        // console.log(item);
      });
      
    }
  }
  family.onUpdateNode(function(args){
    console.log("on update");
    console.log(args);
    var oldData = args.oldData;
    var addNodesData = oldData.addNodesData;
    var updateNodesData = oldData.updateNodesData;
    
    // var updatedNodes = [];
    // addNodesData.forEach(function(item, index) {
    //   updatedNodes.push(item);
    // });
    // updateNodesData.forEach(function(item, index) {
    //   updatedNodes.push(item);
    // });
    // console.log(updatedNodes);
  
    // CHECK IF NEW NODE IS PARENT
    //xxx3
    addNodesData.forEach(function(item, index) {
      var new_data_id = item.id;
      if(!item.hasOwnProperty('mid')  && !item.hasOwnProperty('fid') ){
        console.log("this is parrent node");
        console.log("processing add id_child in new node")
        if(updateNodesData.length>0){
          UpData0_id = updateNodesData[0].id;
          item.id_child = UpData0_id;
          console.log("id_child added")
        }
      }
    });
    // addNodesData.forEach(function(item, index) {
    //   var mid = item.hasOwnProperty('mid');
    //   var fid = item.hasOwnProperty('fid');
    //   var pids = item.hasOwnProperty('pids');
    //   var UpData0_id = 0;
    //   var partner_status = false;
    //   if(updateNodesData.length>0){
    //     UpData0_id = updateNodesData[0].id;
    //     item.id_child = UpData0_id;
        
    //   }
    //   if(pids){
    //     for (var i = 0; i < pids.length; i++) {
    //       var pid_n = pids[i];
    //       if(pid_n == UpData0_id){
    //         partner_status = true;
    //         break;
    //       }
    //     }
    //   }
    //   if(!partner_status && ){
        
    //   }
    // });




    // console.log("addNodeData");
    // console.log(addNodesData);
    // console.log("updateNodeData");
    // console.log(updateNodesData);
  });

  
  
    $(document).ready(function() {
      reload_data_family(family);
    });
    

  $('#frm_fam_partner').select2({
    ajax: {
      url: 'index.php?ajaxAction=select_by_name',
      dataType: 'json',
      delay: 200,
      processResults: function (data) {
        return {
            results: data
        };
      }
    },
    minimumInputLength: 3,
    placeholder: "Search name",
    dropdownParent:"#modal_form_family",
    allowClear: true,
    multiple:true,
  });

  $('#frm_fam_parent1').select2({
    ajax: {
      url: 'index.php?ajaxAction=select_by_name',
      dataType: 'json',
      delay: 200,
      processResults: function (data) {
        return {
            results: data
        };
      }
    },
    minimumInputLength: 3,
    placeholder: "Search name",
    dropdownParent:"#modal_form_family",
  });

  $('#frm_fam_parent2').select2({
    ajax: {
      url: 'index.php?ajaxAction=select_by_name',
      dataType: 'json',
      delay: 200,
      processResults: function (data) {
        return {
            results: data
        };
      }
    },
    minimumInputLength: 3,
    placeholder: "Search name",
    dropdownParent:"#modal_form_family",
  });


  
  
  

})();


