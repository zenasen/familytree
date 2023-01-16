(function() {
  var tabEl = $('button[data-bs-toggle="tab"]')
  tabEl.on('shown.bs.tab', function (event) {
    var page = event.target.dataset.bsTarget;
    page = page.replace("#", "");
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);

  })

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
        
        obj_family.load(response);
        if(status == "load"){
          obj_family.load(response);
        }
        if(status == "update"){
          // obj_family.update(response);
          location.reload();
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

  // async function save_data_n(data, reload_status = false, _callback){
  //   console.log(data);
  //   return j_ajax = $.post("index.php", data, function(response) {
  //     if(reload_status == "reload"){
  //       reload_data_family(family, "update");  
  //     }
  //     return response;
  //   }, "json");

  //   // j_ajax.fail(function(data) {
  //   //   console.log("fail data");
  //   //   console.log(data);
  //   //   return data;
  //   // });
  // }




  editForm.prototype.init = function(obj) {
    
    this.obj = obj;
    this.crudform_id = document.querySelector("#frm_fam_id");
    this.crudform_id_tree = document.querySelector("#frm_fam_id_tree");
    this.crudform_name = document.querySelector("#frm_fam_name");
    this.crudform_namefull = document.querySelector("#frm_fam_fullname");
    this.crudform_gender = document.querySelector("#frm_gender");
    this.crudform_tag = document.querySelector("#frm_fam_tag");
    // this.crudform_child = document.querySelector("#frm_fam_child");

    this.crudform_btn_cancel = document.querySelector("#crud_table input[value='Cancel']");
    this.crudform_btn_save = document.querySelector("#modal_form_family #save_frm_fam");
    this.crudform_btn_delete = document.querySelector("#modal_form_family #delete_frm_fam");
    this.modal_form_family = new bootstrap.Modal(document.getElementById('modal_form_family'));

    var that = this;
    
    this.crudform_btn_delete.addEventListener("click",function(){
      var id = $("#frm_fam_id").val(),
        nama = $("#frm_fam_name").val();

      var result = confirm("Delete data orang dengan nama: "+nama);

      if (result) {
        var data = {
          'id': id,
          'ajaxAction':'delete_data_family',
        }
        
        var j_ajax = $.post("index.php", data, function(response) {
          console.log(response);
          setTimeout(function(){
            reload_data_family(family, "update");  
            $("#close_frm_fam").click();
          },100)
        }, "json");

        j_ajax.fail(function(data) {
          setTimeout(function(){
            reload_data_family(family, "update");  
            $("#close_frm_fam").click();
            alert("save error");
            console.log("fail data");
            console.log(data);
          },100);
        });

      }
    });

    this.crudform_btn_save.addEventListener("click", function() {
        var id = $("#frm_fam_id").val(),
            id_tree = $("#frm_fam_id_tree").val(),
            nama = $("#frm_fam_name").val(),
            nama_full = $("#frm_fam_fullname").val(),
            gender = $("#frm_gender").val(),
            partner = $("#frm_fam_partner").val(),
            parent_m = $("#frm_fam_parent1").val(),
            parent_f = $("#frm_fam_parent2").val(),
            // id_child = $("#frm_fam_child").val();
            tag = $("#frm_fam_tag").val(),
            foto_src = $("#uploaded_image").attr("src");

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
          'tag':tag,
          'foto_src':foto_src,
          'ajaxAction':'save_data_family',
        }
        console.log("data to save");
        console.log(data);


        //SAVE OR UPDATE DATA 
        var j_ajax = $.post("index.php", data, function(response) {
          console.log(response);
          // setTimeout(function(){
            reload_data_family(family, "update");  
            $("#close_frm_fam").click();
          // },100)
          
          
        }, "json");

        j_ajax.fail(function(data) {
          setTimeout(function(){
            reload_data_family(family, "update");  
            $("#close_frm_fam").click();
            alert("save error");
            console.log("fail data");
            console.log(data);
          },100)
        });
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
        // parent_ch = $("#frm_child");
        tag = $("#frm_fam_tag");


    id_el.val("");
    id_tree.val("");
    nama_el.val("");
    nama_full_el.val("");
    gender_el.val("");
    partner_el.empty();
    parent_m_el.empty();
    parent_f_el.empty();
    // parent_ch.val("");
    tag.empty();
    $("#uploaded_image").attr("src","upload/person.png")

  }


  function select_el_add_data(arr_ids, select_el){
    var str_ids = arr_ids.toString();
    var data = {
      'ids': arr_ids,
      'ajaxAction':'select_data_by_id2',
    }
    var j_ajax = $.post("index.php", data, function(response) {
      $.each(response, function( index, value ) {
        var option = new Option(value[0].name, value[0].id, true, true);
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

  

  editForm.prototype.show = function(nodeId) {
    // this.hide();

    this.nodeId = nodeId;
    var node = family.get(nodeId);
    //xxxx2
    this.modal_form_family.show();
    reset_form();
    if(node.id){
      this.crudform_id.value = check_property(node, "id_db", "");
      this.crudform_id_tree.value = check_property(node, "id", "");
      this.crudform_name.value = check_property(node, "name", "");
      this.crudform_namefull.value = check_property(node, "fullname", "");
      this.crudform_gender.value = check_property(node,"gender", "");
      // this.crudform_child.value = check_property(node, "id_child", "");
      this.crudform_tag.value = check_property(node, "tag", "");
      $("#uploaded_image").attr("src", "upload/person.png");  
      var src_foto = check_property(node, "photo", "");
      if(src_foto){
        $("#uploaded_image").attr("src", src_foto);  
      }
      
      
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
  
  FamilyTree.templates.john_male.plus =
      '<circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
      + '<line x1="-11" y1="0" x2="11" y2="0" stroke-width="1" stroke="#aeaeae"></line>'
      + '<line x1="0" y1="-11" x2="0" y2="11" stroke-width="1" stroke="#aeaeae"></line>';
  FamilyTree.templates.john_male.minus =
      '<circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
      + '<line x1="-11" y1="0" x2="11" y2="0" stroke-width="1" stroke="#aeaeae"></line>';
  FamilyTree.templates.john_female.plus =
      '<circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
      + '<line x1="-11" y1="0" x2="11" y2="0" stroke-width="1" stroke="#aeaeae"></line>'
      + '<line x1="0" y1="-11" x2="0" y2="11" stroke-width="1" stroke="#aeaeae"></line>';
  FamilyTree.templates.john_female.minus =
      '<circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
      + '<line x1="-11" y1="0" x2="11" y2="0" stroke-width="1" stroke="#aeaeae"></line>';

  FamilyTree.templates.john_female.defs = '<g transform="matrix(0.05,0,0,0.05,-12,-9)" id="heart"><path fill="#F57C00" d="M438.482,58.61c-24.7-26.549-59.311-41.655-95.573-41.711c-36.291,0.042-70.938,15.14-95.676,41.694l-8.431,8.909  l-8.431-8.909C181.284,5.762,98.663,2.728,45.832,51.815c-2.341,2.176-4.602,4.436-6.778,6.778 c-52.072,56.166-52.072,142.968,0,199.134l187.358,197.581c6.482,6.843,17.284,7.136,24.127,0.654 c0.224-0.212,0.442-0.43,0.654-0.654l187.29-197.581C490.551,201.567,490.551,114.77,438.482,58.61z"/><g>';
  FamilyTree.templates.john_male.defs = '<g transform="matrix(0.05,0,0,0.05,-12,-9)" id="heart"><path fill="#F57C00" d="M438.482,58.61c-24.7-26.549-59.311-41.655-95.573-41.711c-36.291,0.042-70.938,15.14-95.676,41.694l-8.431,8.909  l-8.431-8.909C181.284,5.762,98.663,2.728,45.832,51.815c-2.341,2.176-4.602,4.436-6.778,6.778 c-52.072,56.166-52.072,142.968,0,199.134l187.358,197.581c6.482,6.843,17.284,7.136,24.127,0.654 c0.224-0.212,0.442-0.43,0.654-0.654l187.29-197.581C490.551,201.567,490.551,114.77,438.482,58.61z"/><g>';


  var family = new FamilyTree(document.getElementById("tree"), {
    mouseScrool: FamilyTree.action.none,
    template: "john",
    nodeBinding: {
      field_0: "name",
      img_0: "photo"
    },
    searchFields: ["name", "fullname","tag"],
    editUI: new editForm(),
    scaleInitial: FamilyTree.match.boundary,
    mouseScrool: FamilyTree.action.none,
    showXScroll: FamilyTree.scroll.visible,
    showYScroll: FamilyTree.scroll.visible,
    mouseScrool: FamilyTree.action.zoom,
    // nodeTreeMenu: true,
  });

  family.on('expcollclick', function (sender, isCollapsing, nodeId) {
      var node = family.getNode(nodeId);
      if (isCollapsing){
          family.expandCollapse(nodeId, [], node.ftChildrenIds)
      }
      else{
          family.expandCollapse(nodeId, node.ftChildrenIds, [])
      }
      return false;
  });

      family.on('render-link', function(sender, args){
          if (args.cnode.ppid != undefined)
              args.html += '<use data-ctrl-ec-id="' + args.node.id + '" xlink:href="#heart" x="' + (args.p.xb) + '" y="' + (args.p.ya ) +'"/>';
          if (args.cnode.isPartner && args.node.partnerSeparation == 30)
               args.html += '<use data-ctrl-ec-id="' + args.node.id + '" xlink:href="#heart" x="' + (args.p.xb) + '" y="' + (args.p.yb) +'"/>';
          
      });

  

  $("#addNewFamily, #addNewFamily2").click(function(){
    reset_form();
    var modal_form = new bootstrap.Modal(document.getElementById('modal_form_family'));
    modal_form.show();
  });

  async function on_updatenode_insert_nodes_save(node_n){
   var data = {
      'id': check_property(node_n, "id_db", ""),
      'nama':check_property(node_n, "name", ""),
      'nama_full':check_property(node_n, "fullname", ""),
      'gender':check_property(node_n, "gender", ""),
      'partner':false,
      'parent_m':0,
      'parent_f':0,
      'ajaxAction':'save_data_family',
    }
    var postResult = $.post('index.php', data).then();
    console.log("save node");
    console.log(node_n);
    return postResult;
  };

  async function on_updatenode_insert_nodes($data_nodes){
    for (node_n of $data_nodes) {
      console.log()
      let result_ = await on_updatenode_insert_nodes_save(node_n);
      var result_arr = JSON.parse(result_);
      var new_id_db = result_arr.new_id;
      node_n.id_db = new_id_db;
    }
    console.log('All node insert successfully');
    console.log(updatedNodes);
    return $data_nodes;
  }
  
  async function on_updatenode_update_nodes($data_nodes){
    
  }

  family.onUpdateNode(function(args){
    // console.log("on update");
    // console.log(args);
    var oldData = args.oldData;
    var addNodesData = oldData.addNodesData;
    var updateNodesData = oldData.updateNodesData;
    
    var updatedNodes = [];
    addNodesData.forEach(function(item, index) {
      updatedNodes.push(item);
    });
    updateNodesData.forEach(function(item, index) {
      updatedNodes.push(item);
    });
    console.log(updatedNodes);

    
    // console.log(" PROCESS 1 | INSERT NEW DATA=========================================");
    // let updatedNodes_fun_n = (node_n) => {
    //   return new Promise(resolve => {
    //     if(!node_n.hasOwnProperty("id_db")){
    //       var pids = check_property(node_n, "pids", false)
    //       if(pids){
    //         pids = pids.toString();
    //       }
    //       var data = {
    //         'id': check_property(node_n, "id_db", ""),
    //         'nama':check_property(node_n, "name", ""),
    //         'nama_full':check_property(node_n, "fullname", ""),
    //         'gender':check_property(node_n, "gender", ""),
    //         'partner':false,
    //         'parent_m':0,
    //         'parent_f':0,
    //         'ajaxAction':'save_data_family',
    //       }
    //       var postResult = $.post('index.php', data).then();
    //       resolve(postResult);
    //     }
    //   });
    // };

    // let updatedNodes_fun = async () => {
    //   for (node_n of updatedNodes) {
    //     console.log()
    //     let result_ = await updatedNodes_fun_n(node_n);
    //     var result_arr = JSON.parse(result_);
    //     var new_id_db = result_arr.new_id;
    //     node_n.id_db = new_id_db;
    //   }
    //   console.log('All node insert successfully');
    //   console.log(updatedNodes);
    // };
    // updatedNodes_fun();

    async function processing_nodes(){
      let updatedNodes_s1 = await on_updatenode_insert_nodes(updatedNodes);
      console.log("proses 1 finish")
      // let updatedNodes_s2 = await on_updatenode_update_nodes(updatedNodes_s1);
    }
    processing_nodes();

    

    console.log(" PROCESS 1 | INSERT NEW DATA END =========================================");

    //console.log(" PROCESS 2 | UPDATE DATA=========================================");
  });


  
  
  $(document).ready(function() {
    reload_data_family(family);

    $("#table_tbl_person input[type='button'][value='Edit']").on("click", function (e) {
      e.preventDefault();
      console.log("xxx"); 
      var modal_form_family = new bootstrap.Modal(document.getElementById('modal_form_family'));
      modal_form_family.show();
      reset_form();

      // get data from row
      var vthis_btn = $(this);
      var vthis_row = vthis_btn.closest("tr");
      var this_row_cols = vthis_row.find("td");
      var this_data = [];
      this_data["id"]= $(this_row_cols[0]).text();
      this_data["nama"]= $(this_row_cols[1]).find("span.editable").text();
      this_data["fullname"]= $(this_row_cols[2]).find("span.editable").text();
      this_data["gender"]= $(this_row_cols[3]).find("span.editable").text();
      this_data["tag"]= $(this_row_cols[4]).find("span.editable").text();
      this_data["foto_src"] = "";
      var src_url = "";
      var img_el = $(this_row_cols[5]).find("img");
      if(img_el){
        src_url = img_el.attr("src");
        this_data["foto_src"] = src_url;
      }
      this_data["id_partner"]= $(this_row_cols[6]).find("span.editable").text();
      this_data["id_parent_ayah"]= $(this_row_cols[7]).find("span.editable").text();
      this_data["id_parent_ibu"]= $(this_row_cols[8]).find("span.editable").text();

      // set data in form
      $("#frm_fam_id").val(this_data["id"]);
      $("#frm_fam_name").val(this_data["nama"]);
      $("#frm_fam_fullname").val(this_data["fullname"]);
      $("#frm_gender").val(this_data["gender"]);
      $("#frm_fam_tag").val(this_data["tag"]);
      if(this_data["foto_src"] != ""){
        $("#uploaded_image").attr("src", this_data["foto_src"]);  
      }      
      
      var ids_partner = this_data["id_partner"];
      var id_parent_m = this_data["id_parent_ayah"];
      var id_parent_f = this_data["id_parent_ibu"];
      
      if(ids_partner){
        select_el_add_data(ids_partner, "#frm_fam_partner");
      }  
      if(id_parent_m){
        select_el_add_data(id_parent_m, "#frm_fam_parent1");
      }  
      if(id_parent_f){
        select_el_add_data(id_parent_f, "#frm_fam_parent2");
      }  
      
    });

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


  // IMAGE UPLOADER  
  $(document).ready(function(){
    var $modal = $('#modal_cropper');
    var image = document.getElementById('sample_image');
    var cropper;


    $('#upload_foto').change(function(event){
      var files = event.target.files;

      var done = function(url){
        image.src = url;
        $modal.modal('show');
      };

      if(files && files.length > 0)
      {
        reader = new FileReader();
        reader.onload = function(event)
        {
          done(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    });  

    $modal.on('shown.bs.modal', function() {
      cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 3,
        preview:'.preview'
      });
    }).on('hidden.bs.modal', function(){
      cropper.destroy();
      cropper = null;
    });

    $('#crop').click(function(){
      canvas = cropper.getCroppedCanvas({
        width:700,
        height:700
      });

      canvas.toBlob(function(blob){
        url = URL.createObjectURL(blob);
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function(){
          var base64data = reader.result;
          $('#uploaded_image').attr('src', base64data);
          $modal.modal('hide');
        };
      });
    });

  })
  

  // IMAGE UPLOADER  END
  
  

})();





