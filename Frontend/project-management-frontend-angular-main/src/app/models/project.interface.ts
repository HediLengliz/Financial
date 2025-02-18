// export class Project {
//     name: any;
//     status: any;
//     priority: any;
//     start_date: any;
//     end_date: any;
//     admin_id: any;
//     client_id: any;
//     member_id: any;
//     image: any;
//     description: any;
//     created_by: any;
//     updated_by: any;
// }

export class Project {
  name: any;
  status: any;
  priority: any;
  start_date: any;
  end_date: any;
  admin_id: any;
  client_id: any;
  member_id: any[] = []; // Ensure this is an array
  image: any;
  imageUrl: any;
  description: any;
  created_by: any;
  updated_by: any;
  members: any[] = [];
}
  