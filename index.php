<?php

	require_once('preheader.php'); // <-- this include file MUST go first before any HTML/output
	include('crud_custom.php'); 
	include('ajaxCRUD.class.php'); // <-- this include file MUST go first before any HTML/output
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Family Tree</title>
		<!-- these js/css includes are ONLY to make the calendar widget work (fldDateMet);
			 these includes are not necessary for the class to work!! -->
		<link rel="stylesheet" href="libs/bootstrap/css/bootstrap.min.css">
		<link rel="stylesheet" href="libs/select2js/css/select2.css">
		<link rel="stylesheet" href="libs/dropzones/dropzone.css">
		<link rel="stylesheet" href="libs/cropperjs/cropper.min.css">
		<style type="text/css">
			.image_area {
			  position: relative;
			}
			img {
			  display: block;
			  /* This rule is very important, please don't ignore this */
			  max-width: 100%;
			}
			.preview {
	  			overflow: hidden;
	  			width: 160px; 
	  			height: 160px;
	  			margin: 10px;
	  			border: 1px solid red;
			}
			#uploaded_image{
		  width:300px; 
		  height:300px;
		}
		.img-wrp{
		  width:700px;
		  max-width: 100%;
		  position:relative;
		  margin-bottom:10px;
		}
		.img-wrp:before{
		  content:'';
		  padding-bottom:100%;
		  width:100%;
		  display:block;
		}
		.select2-container{
		  display: block;
		  width:100% !Important;
		}
		#uploaded_image{
		  position:absolute;
		  left:0px;
		  top:0px;
		  width:100%;
		  height:100%;
		}

		.select2-container--default .select2-selection--single .select2-selection__arrow{
		    height: 38px;
		}
		.select2-container .select2-selection--single{
			height:38px;
		}
		.select2-container--default .select2-selection--single .select2-selection__rendered{
			line-height:34px;
		}
		#upload_foto{
		  position: absolute;
		  top: 0px;
		  left: 0px;
		  width: 100%;
		  height: 100%;
		  opacity: 0;
		  background: #fff;
		}
		#tree_container{
		  border:3px solid #aaa;
		  width:calc(100% - 20px);
		  margin-left:10px;
		}
		#tbl_person thead th { 
			position: sticky; top: 0; 
		}

		#tbl_person{
		 max-height:600px;
		  overflow:auto;
		}
		input[value="Add Item"]{
		  display:none;
		}
		</style>

		
		<!-- <script src="js/jquery.min.js"></script> -->
		<!-- <script src="js/jquery.validate.min.js"></script> -->
		<!-- <script src="js/validation.js"></script> -->
		<!-- <script src="js/jquery.maskedinput.js"></script> -->
		<!-- <script src="js/javascript_functions.js"></script> -->	
	</head>
	<body>

<?php
	
    $tbl_person = new ajaxCRUD("Item", "tbl_person", "id", "./");
    // $tbl_person->omitPrimaryKey();

    $tbl_person->displayAs("id", "ID");
    $tbl_person->displayAs("name_nick", "Name");
    $tbl_person->displayAs("name_full", "Full Name");
    $tbl_person->displayAs("gender", "Gender");
    $tbl_person->displayAs("tag", "Tag");
    $tbl_person->displayAs("foto", "Foto");
    $tbl_person->displayAs("id_partner", "ID Partner");
    $tbl_person->displayAs("id_parent1", "ID Parent 1");
    $tbl_person->displayAs("id_parent2", "ID Parent 2");
    $tbl_person->addOrderBy("ORDER BY id desc");
    $tbl_person->setLimit(500);

    $tbl_person->formatFieldWithFunction('foto', 'makeImg');
    function makeImg($val){
    	return "<img src=\"$val\" width=\"100\" />";
    }

    function check_active($this_nav){
    	
    	$page = isset($_GET["page"]) ? $_GET["page"] : "nav-home";
    	if($page == $this_nav){
    		return "active show"	;
    	};
    	return "";
    }

?>	
	<nav>
	  <div class="nav nav-tabs" id="nav-tab" role="tablist">
	    <button class="nav-link <?php echo check_active("nav-home"); ?>" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Table</button>
	    <button class="nav-link <?php echo check_active("nav-profile"); ?>" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Tree</button>
	  </div>
	</nav>
	<div class="tab-content" id="nav-tabContent">
	  <div class="tab-pane fade show <?php echo check_active("nav-home"); ?>" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
	  	<!-- --- isi tab table --- -->
	  	<button type="button" class="btn btn-success m-3" id="addNewFamily2">Add New Family</button>
		<div class="crud_container" id="crud_table">
			<?php 
				// $tbl_person->addAjaxFilterBox('id, name_nick, name_full, tag');
				$tbl_person->addAjaxFilterBox('id');
				$tbl_person->addAjaxFilterBox('name_nick');
				$tbl_person->addAjaxFilterBox('name_full');
				$tbl_person->addAjaxFilterBox('tag');
				// $tbl_person->addAjaxFilterBoxAllFields();
				// $tbl_person->addButtonToRow("Edit", "myOwnUpdateForm.php", "all");
				$tbl_person->addButtonToRow("Edit", "","", "return");
				$tbl_person->showTable();
			?>
		</div>
		<!-- --- isi tab table end --- -->
	  </div>
	  <div class="tab-pane fade <?php echo check_active("nav-profile"); ?>" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
	  	<!-- --- isi tab tree --- -->
	  	<button type="button" class="btn btn-success m-3" id="addNewFamily">Add New Family</button>
		<div id="tree_container">
			<div style="width:100%; height:700px;" id="tree"/>
			</div>
		</div>
		<!-- --- isi tab tree end --- -->
	  </div>
	  
	</div>
	
	<div class="modal" tabindex="-1" id="modal_form_family">
		<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Form Family</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div style="display: none;">
						<div class="mb-3">
							<label class="form-label">ID</label>
							<input type="text" class="form-control" id="frm_fam_id" disabled placeholder="AUTO">
						</div>
						<div class="mb-3">
							<label class="form-label">ID Tree</label>
							<input type="text" class="form-control" id="frm_fam_id_tree" disabled>
						</div>
					</div>
					<div class="mb-3">
						<label class="form-label">Foto</label>
						<div class="img-wrp">
							<img src="upload/person.png" id="uploaded_image" class="img-responsive img-circle" />
							<input type="file" name="image" class="image" id="upload_foto" />
						</div>
					</div>
					<div class="mb-3">
						<label class="form-label">Name</label>
						<input type="text" class="form-control" id="frm_fam_name" placeholder="">
					</div>
					<div class="mb-3">
						<label class="form-label">Full Name</label>
						<input type="text" class="form-control" id="frm_fam_fullname" placeholder="">
					</div>
					<div class="mb-3">
						<label class="form-label">Gender</label>
						<select class="form-select"  id="frm_gender">
							<option value="">Select gender</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>
					<div class="mb-3">
						<label class="form-label">Partner</label>
						<select class="form-select"  id="frm_fam_partner"></select>
					</div>
					<div class="mb-3">
						<label class="form-label">Father</label>
						<select class="form-select" id="frm_fam_parent1" ></select>
					</div>
					<div class="mb-3">
						<label class="form-label">Mother</label>
						<select class="form-select" id="frm_fam_parent2"></select>
					</div>
					<div class="mb-3">
						<label class="form-label">Tag</label>
						<textarea class="form-control" id="frm_fam_tag" placeholder=""></textarea>
					</div>
					<!-- <div class="mb-3" style="opacity: 0.5;">
						<label class="form-label">Child</label>
						<input type="text" class="form-control" id="frm_fam_child" placeholder="">
					</div> -->
				</div>
				<div class="modal-footer">
					<button type="button" id="delete_frm_fam" class="btn btn-danger">Delete</button>
					<button type="button" id="close_frm_fam" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					<button type="button" id="save_frm_fam" class="btn btn-primary">Save changes</button>

				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_cropper" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
	  	<div class="modal-dialog modal-lg" role="document">
	    	<div class="modal-content">
	      		<div class="modal-header">
	        		<h5 class="modal-title">Crop Image Before Upload</h5>
	        		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
	          			<span aria-hidden="true">×</span>
	        		</button>
	      		</div>
	      		<div class="modal-body">
	        		<div class="img-container">
	            		<div class="row">
	                		<div class="col-md-8">
	                    		<img src="" id="sample_image" />
	                		</div>
	                		<div class="col-md-4">
	                    		<div class="preview"></div>
	                		</div>
	            		</div>
	        		</div>
	      		</div>
	      		<div class="modal-footer">
	      			<button type="button" id="crop" class="btn btn-primary">Crop</button>
	        		<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
	      		</div>
	    	</div>
	  	</div>
	</div>

	<div id="family_form">
	</div>
	<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
	<script type="text/javascript" src="libs/bootstrap/js/bootstrap.min.js"></script>
	<!-- <script type="text/javascript" src="libs/bootstrap/js/bootstrap-history-tabs.js"></script> -->
	<script type="text/javascript" src="libs/select2js/js/select2.full.min.js"></script>
	<script type="text/javascript" src="js/BALKAN_FamilyTreeJS/familytree.js"></script>
	<!-- <script type="text/javascript" src="libs/dropzones/dropzone.js"></script> -->
	<script src="https://unpkg.com/dropzone@5/dist/min/dropzone.min.js"></script>

	<script type="text/javascript" src="libs/cropperjs/cropper.min.js"></script>
	<script type="text/javascript" src="index.js?v=5"></script>

</body>