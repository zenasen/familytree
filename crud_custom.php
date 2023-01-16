<?php 
class class_crud_custom{
	private $tb_name = 'tbl_person';
	
	public function __construct( $params = null ){
		// global $headerAdded;
        //$headerAdded = TRUE;
        // require_once  'preheader.php';
        // if ($headerAdded === "") $headerAdded = FALSE;
		$ajaxAction = isset($_REQUEST['ajaxAction']) ? $_REQUEST['ajaxAction'] : false;
		if($ajaxAction == "select_data_by_id"){
			$id = isset($_POST['id']) ? $_POST['id'] : false;
			if(!$id){
				echo "data kosong";
				return;
			}
			$this->show_data_family($id);
		}
		if($ajaxAction == "select_data_by_id2"){
			$ids = isset($_POST['ids']) ? $_POST['ids'] : false;
			if(!$ids){
				echo "data kosong";
				return;
			}
			$this->select_data_by_id($ids, false, true);
		}
		if($ajaxAction == "select_data_all"){
			$this->select_data_all();
		}
		if($ajaxAction == "select_by_name"){
			$data_return[] = (object) ['id' => '0','text' => "kosong"];
			$search_param = isset($_GET['q']) ? $_GET['q'] : false;
			if(!$data_return){
				echo json_encode($data_return);
				return;
			}
			$this->select_by_name($search_param);
		}
		if($ajaxAction == "save_data_family"){
			$this->save_data_family();
		}
		if($ajaxAction == "delete_data_family"){
			$this->delete_data_family();
		}
	}
	
	public function check_input($new_data, $default_return = ""){
		if(!isset($new_data)){
			return $default_return;
		}
		if($new_data == ""){
			return $default_return;
		}
		return $new_data;
	}
	
	public function update_partner_proses2($id_person, $id_partner, $status_partner="add"){
		//get person partner
		$query_str = "select * from ".$this->tb_name." where id='".$id_person."'";
		$rows = q($query_str);
		$data_person = false;
		if($rows){
			$data_person = $rows[0];
		}
		//update data person
		if($data_person){
			$data_person_partner_str = $data_person["id_partner"];
			// EDITING ID --------------
			// if data array
			if (str_contains($data_person_partner_str, ',')) { 
				$data_person_partner_arr = json_decode($data_person_partner_str);
				if($status_partner == "add"){
					$status_person_has_this_partner = false;
					foreach ($data_person_partner_arr as $value) {
						if($value == $id_partner){
							$status_person_has_this_partner = true;
							break;
						}
					}
					if($status_person_has_this_partner == false){
						$data_person_partner_arr[] = intval($id_partner);
					}
					$data_person_partner_str = json_encode($data_person_partner_arr);
				}
				if($status_partner == "remove"){
					$new_arr = [];
					foreach ($data_person_partner_arr as $value) {
						if(intval($value) != intval($id_partner) ){
							$new_arr[] = $value;
						}
					}
					if(count($new_arr) == 1){
						$data_person_partner_str = $new_arr[0];
					}else{
						$data_person_partner_str = json_encode($new_arr);
					}
				}
			}
			// if not array
			if (str_contains($data_person_partner_str, ',') == false) { 
				if($status_partner == "add"){
					// if has no id
					if(intval($data_person_partner_str) == 0){
						$data_person_partner_str = $id_partner;
					}
					// if has id
					if(intval($data_person_partner_str) > 0){
						if(intval($data_person_partner_str) != intval($id_partner)){
							$new_arr[] = $data_person_partner_str;
							$new_arr[] = $id_partner;
							$data_person_partner_str = json_encode($new_arr);
						}
					}
				}
				if($status_partner == "remove"){
					// if has id
					if(intval($data_person_partner_str) > 0){
						if(intval($data_person_partner_str) == intval($id_partner)){
							$data_person_partner_str = "";
						}
					}
				}
			}
			// EDITING ID END--------------
			// update date person
			$query_str = "UPDATE $this->tb_name 
						  SET id_partner = '$data_person_partner_str' 
						  WHERE id=$id_person";
			$success = qr($query_str);
		}
	}
	
	public function update_partner_proses1($id_person, $old_partner, $new_partner){
		$removed_id_arr = [];
		$added_id_arr = [];
		$data_return["removed_ids"] = $removed_id_arr;
		$data_return["added_ids"] = $added_id_arr;
		if($old_partner == $new_partner){
			return $data_return;
		}
		$old_partner_arr = false;
		$new_partner_arr = false;
		if (str_contains($old_partner, ',')) { 
			$old_partner_arr = json_decode($old_partner);
		}
		if (str_contains($new_partner, ',')) { 
			$new_partner_arr = json_decode($new_partner);
		}
		//find removed id
		if($old_partner_arr && $new_partner_arr){
			$diff_id = array_diff($old_partner_arr, $new_partner_arr);
			$removed_id_arr = $diff_id;
		}
		if($old_partner_arr && $new_partner_arr == false){
			foreach ($old_partner_arr as $old_partner_id) {
				if($old_partner_id != $new_partner){
					$removed_id_arr[] = $old_partner_id; 
				}
			}
		}
		if($old_partner_arr == false && $new_partner_arr){
			$status_removed = true;
			foreach ($new_partner_arr as $new_partner_id) {
				if($new_partner_id == $old_partner){
					$status_removed = false;
					break;
				}
			}
			if($status_removed){
				$removed_id_arr[] = $old_partner; 
			}
		}
		if($old_partner_arr==false && $new_partner_arr==false){
			$removed_id_arr[] = $old_partner;
		}
		//find added id
		$added_id_arr = [];
		if($old_partner_arr && $new_partner_arr){
			$diff_id = array_diff($new_partner_arr, $old_partner_arr);
			$added_id_arr = $diff_id;
		}
		if($old_partner_arr && $new_partner_arr == false){
			$status_added = true;
			foreach ($old_partner_arr as $old_partner_id) {
				if($old_partner_id == $new_partner){
					$status_added = false;
				}
			}
			if($status_added){
				$added_id_arr[] = $new_partner;
			}
		}
		if($old_partner_arr == false && $new_partner_arr){
			foreach ($new_partner_arr as $new_partner_id) {
				if($new_partner_id != $old_partner){
					$added_id_arr[] = $new_partner_id;
				}
			}
		}
		if($old_partner_arr==false && $new_partner_arr==false){
			$added_id_arr[] = $new_partner;
		}
		// $data_return["removed_ids"] = $removed_id_arr;
		// $data_return["added_ids"] = $added_id_arr;
		// print_r("removed_id_arr");
		// print_r($removed_id_arr);
		// print_r("added_id_arr");
		// print_r($added_id_arr);
		foreach ($removed_id_arr as $person_n_id) {
			$this->update_partner_proses2($person_n_id, $id_person, $status_partner="remove");
		}
		foreach ($added_id_arr as $person_n_id) {
			$this->update_partner_proses2($person_n_id, $id_person, $status_partner="add");
		}
		// return $data_return;
		// get removed data
	}
	
	public function delete_data_family(){
		$id = $_POST['id'];
		$query_str_old = "select * from ".$this->tb_name." where id='".$id."'";
		$old_data = q($query_str_old);
		$old_data_partner = $old_data[0]['id_partner'];
		$old_data_partner_arr = [];
		if (str_contains($old_data_partner, ',')) { 
			$old_data_partner_arr = json_decode($old_data_partner);
		}else{
			$old_data_partner_arr[] = $old_data_partner;
		}
		foreach ($old_data_partner_arr as $person_n_id) {
			$this->update_partner_proses2($person_n_id, $id, $status_partner="remove");
		}
		// DELETE FROM `table_name` [WHERE condition];
		$query_str = "DELETE FROM $this->tb_name WHERE id=$id";
		$return_obj['status'] = 'success';
		$success = qr($query_str);
		if($success){
			echo json_encode($return_obj);	
			return;
		}
		echo json_encode($return_obj['status']="failed");
		return;
	}
	
	public function save_data_family(){
		$id = $_POST['id'];
		$nama = $this->check_input($_POST['nama']);
		$nama_full = $this->check_input($_POST['nama_full']);
		$gender = $this->check_input($_POST['gender']);
		$partner = $this->check_input($_POST['partner'], 0);
		$parent_m = $this->check_input($_POST['parent_m'], 0);
		$parent_f = $this->check_input($_POST['parent_f'], 0);
		$tag = $this->check_input($_POST['tag'], 0);
		if (str_contains($partner, ',')) { 
			$partner = "[".$partner."]";
		}
		$foto_src = $this->check_input($_POST['foto_src'], 0);
		if($foto_src!=""){
			if (str_contains($foto_src, 'data:image')) { 
				$image_array_1 = explode(";", $foto_src);
				$image_array_2 = explode(",", $image_array_1[1]);
				$data = base64_decode($image_array_2[1]);
				$image_name = 'upload/'.$id."-".time().'.png';
				file_put_contents($image_name, $data);
				$foto_src = $image_name;
			}
		}
		$return_obj['status'] = 'success';
		// echo $id;
		if($id == ""){
			//SAVE DATA
			$query_str = "INSERT INTO $this->tb_name (name_nick, name_full, gender, id_partner, id_parent1, id_parent2, tag, foto) 
						  VALUES ('$nama', '$nama_full', '$gender', '$partner', $parent_m, $parent_f, '$tag', '$foto_src')";
			$success = qr($query_str);
			if($success){
				global $mysqliConn, $useMySQLi;
				$insert_id = "";
                if ($useMySQLi){
                	$insert_id = $mysqliConn->insert_id;
                }
                else{
                	$insert_id = mysql_insert_id(); //the old, mysql way of getting it (procedurual php)
                }
                $return_obj["new_id"] = $insert_id;
                $old_data = false;
                $query_str_new = "select * from ".$this->tb_name." where id='".$insert_id."'";
				$new_data = q($query_str_new);
				$new_data_partner = $new_data[0]['id_partner'];
				$this->update_partner_proses1($insert_id, $old_data, $new_data_partner);
                echo json_encode($return_obj);	
				return;
			}
		}
		if($id != ""){
			$query_str_old = "select * from ".$this->tb_name." where id='".$id."'";
			$old_data = q($query_str_old);
			$old_data_partner = $old_data[0]['id_partner'];
			//UPDATE  DATA
			$query_str = "UPDATE $this->tb_name 
						  SET 
						  	name_nick = '$nama', 
						  	name_full = '$nama_full', 
						  	gender = '$gender', 
						  	id_partner = '$partner', 
						  	id_parent1 = $parent_m, 
						  	id_parent2 = $parent_f,
						  	tag = '$tag',
						  	foto = '$foto_src'
						  WHERE id=$id";
			$success = qr($query_str);
			$query_str_new = "select * from ".$this->tb_name." where id='".$id."'";
			$new_data = q($query_str_new);
			$new_data_partner = $new_data[0]['id_partner'];
			$this->update_partner_proses1($id, $old_data_partner, $new_data_partner);
			if($success){
				echo json_encode($return_obj);	
				return;
			}
		}
		echo json_encode($return_obj['status']="failed");
	}
	
	public function select_by_name($search_param){
		$query_str = "select * from ".$this->tb_name." where name_nick like '%".$search_param."%' OR name_full like '%".$search_param."%' ";
		$rows = q($query_str);
		$data_return[] = (object) ['id' => 0,'text' => '---'];
		if($rows){
			foreach ($rows as $key => $value) {
				$id =  $value["id"];
				$nama = $value["name_nick"];
				$data_return[] = (object) ['id' => $id,'text' => $nama];
			}
		}
		echo json_encode($data_return);
	}
	
	public function show_data_family($id){
		// $ids = [];
		// if (strpos($id, ',') !== false) { 
		// 	$ids_arr = explode(',', $id);
		// 	foreach ($ids_arr as $value) {
		// 		$ids[] = trim($value);
		// 	}
		// }
		$data_family = $this->select_data_by_id($id);
		if(count($data_family)>0){
			$id_partner = $data_family[0]["pids"];
			$parent_mid = $data_family[0]["mid"];
			$parent_fid = $data_family[0]["fid"];
			$data_partner = $this->select_data_by_id($id_partner);
			$data_parent_m = $this->select_data_by_id($parent_mid);
			$data_parent_f = $this->select_data_by_id($parent_fid);
			$data_child = $this->select_data_by_id($id, true);
			$data_family = $this->add_row_return_to_json_family($data_family, $data_partner);
			$data_family = $this->add_row_return_to_json_family($data_family, $data_parent_m);
			$data_family = $this->add_row_return_to_json_family($data_family, $data_parent_f);
			$data_family = $this->add_row_return_to_json_family($data_family, $data_child);
		}
		// if(count($ids)<1){
		// 	if(count($data_family)>0){
		// 		$id_partner = $data_family[0]["pids"];
		// 		$parent_mid = $data_family[0]["mid"];
		// 		$parent_fid = $data_family[0]["fid"];
		// 		$data_partner = $this->select_data_by_id($id_partner);
		// 		$data_parent_m = $this->select_data_by_id($parent_mid);
		// 		$data_parent_f = $this->select_data_by_id($parent_fid);
		// 		$data_child = $this->select_data_by_id($id, true);
		// 		$data_family = $this->add_row_return_to_json_family($data_family, $data_partner);
		// 		$data_family = $this->add_row_return_to_json_family($data_family, $data_parent_m);
		// 		$data_family = $this->add_row_return_to_json_family($data_family, $data_parent_f);
		// 		$data_family = $this->add_row_return_to_json_family($data_family, $data_child);
		// 	}
		// }
		echo json_encode($data_family);
	}
	
	public function add_row_return_to_json_family($data_family, $data_new){
		if($data_new){
			if(count($data_new)>0){
				foreach ($data_new as $data_n) {
					array_push($data_family, $data_n);
				}
			}
		}
		return $data_family;
	}
	
	public function select_data_all(){
		$data_return = [];
		$query_str = "select * from ".$this->tb_name;
		$rows = q($query_str);
		if($rows){
			$data_return = $this->convert_row_to_data_family($rows);
		}
		echo json_encode($data_return);
	}
	
	public function check_cell_empty($cell_n){
		if($cell_n == ""){
			return false;
		}
		if($cell_n == "0"){
			return false;
		}
		return true;
	}
	
	public function convert_row_to_data_family($rows){
		$data_return = [];
		foreach ($rows as $key => $value) {
			$datajson = [];
			$datajson["id"] =  $value["id"];
			$datajson["id_db"] =  $value["id"];
			$pids = $value["id_partner"];
			$pids_arr = [];
			if($pids){
				if (str_contains($pids, ',')) { 
					$pids_arr = json_decode($pids);
				}else{
					$pids_arr[] =intval($pids);
				}
			}
			$datajson["pids"] = $pids_arr;
			$datajson["gender"] = $value["gender"];
			$datajson["name"] = $value["name_nick"];
			$datajson["fullname"] = $value["name_full"];
			if($this->check_cell_empty($value["id_parent1"])){
				$datajson["mid"] = $value["id_parent1"];
			}
			if($this->check_cell_empty($value["id_parent2"])){
				$datajson["fid"] = $value["id_parent2"];
			}
			$datajson["tag"] = $value["tag"];
			$datajson["photo"] = $value["foto"];
			// $file_url = "upload/".$value["id"].".png";
			// if(file_exists($file_url)){
			// 	$datajson["photo"] = "upload/".$value["id"].".png";
			// }
			$data_return[] = $datajson;
		}
		return $data_return;
	}
	
	public function select_data_by_id($id, $parent_id = false, $echo_return = false){
		$arr_id = [];
		if(is_array($id)){
			$arr_id = $id;
		}else{
			array_push($arr_id, $id);
		}
		$data_return = [];
		foreach ($arr_id as $id_n) {
			$query_str = "select * from ".$this->tb_name." where id='".$id_n."'";
			if($parent_id == true){
				$query_str = "select * from ".$this->tb_name." where id_parent1='".$id_n."' or id_parent2='".$id_n."'";	
			}
			$rows = q($query_str);
			if($rows){
				$data_return[] = $this->convert_row_to_data_family($rows);
				// foreach ($rows as $key => $value) {
				// 	$datajson["id"] =  $value["id"];
				// 	$datajson["id_db"] =  $value["id"];
				// 	$datajson["pids"] = [$value["id_partner"]];
				// 	$datajson["gender"] = $value["gender"];
				// 	$datajson["name"] = $value["name_nick"];
				// 	$datajson["fullname"] = $value["name_full"];
				// 	if($this->check_cell_empty($value["id_parent1"])){
				// 		$datajson["mid"] = $value["id_parent1"];
				// 	}
				// 	if($this->check_cell_empty($value["id_parent2"])){
				// 		$datajson["fid"] = $value["id_parent2"];
				// 	}
				// 	$datajson["ptags"] = "";
				// 	$datajson["photo"] = "";
				// 	$data_return[] = $datajson;
				// }
			}
		}
		if($echo_return){
			echo json_encode($data_return);
		}
		return $data_return;
		// echo json_encode($data_return);
	}
}
$obj_crud_custom = new class_crud_custom();
