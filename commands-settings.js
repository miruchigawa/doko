import {setCommandsSettings} from './system/command-process.js'


setCommandsSettings({
  
  prefix_list: ['.'],             // tambahkan prefix lain untuk multi-prefix
                                  // (add more prefixes for multi-prefixed bot)
                                  
  banned_word: ["hentai", "jokowi", "ass", "fuck", "f*ck", "dick", "boobs", "pussy", "silit", "eroge", "kontol", "oppai", "chippai", "loli", "bdsm", "porn", "ntr", "naked", "sexy", "full body"],
  
                                  
  owner_id: ["100055146896853", "100029307488613", "100058750012724"], // Owner id untuk commands khusus owner
                                // Owner id for owner specific commands

  menu_command: ['menu', 'help'], // perintah untuk menampilkan menu
                                  // (commands that can be used to show the menu)

  menu_header: '────  List Menu ────',   // Kepala menu
  
  item_format: '\n│   ├── (prefix)(name)',       // Format item menu, (name) akan otomatis diganti jadi nama command
                                       // (menu item format, (name) will be replaced with command names)
                                       // (prefix) akan diganti jadi prefix yg dipakai ketika menampilkan menu
                                       // ((prefix) will be replaced with the prefix used to show the menu)

  group_format: '\n├── [(name)]',   // Format nama grup/folder perintah, (name) akan otomatis diganti jadi nama grup/folder perintah
                                        // (command group name format, (name) will be replaced with the command group/folder name)
  
  menu_footer: '\n└── Rexuint',      // Kaki menu

  show_typing: true,                  //tunjukkan tulisan "sedang mengetik..." ketika merespon perintah
                                      //(whether to show "is typing..." when responding to commands)

  command_not_found: 'Perintah *(prefix)(name)* tidak ditemukan',    // pesan error jika user menggunakan perintah yang tidak tersedia, ganti jadi string kosong untuk mematikan pesan error
                                                                     // error message when user types an unavailable command, use empty string to disable

  group_only_commands: [],        //list perintah yang hanya dapat digunakan di grup
                                      //a list of commands that can only be used in groups

  // pesan yang muncul ketika user menggunakan perintah khusus grup, di dalam private chat
  // (the message as a respond to user using group-only commands in private chat)
  group_only_message: 'Perintah tersebut khusus grup',

  //list perintah yang hanya dapat digunakan oleh admin grup, dan pesan pengingatnya
  // (list of commands that can only be used by group admins, and the message)
  admin_only_commands: [],
  admin_only_message: 'Perintah tersebut khusus admin/owner',

  owner_only_commands : ["eval", "konsole", "restart", "del", "reg", "unreg"],
  owner_only_message : "Perintah tersebut khusus owner",
  
  
  banned_message : "Maaf anda tidak dapat menggunakan perintah itu sementara\nReason: banned_from_bot",
  banned_all : [],
  banned_oj : ["100029969843430", "100068064739725"],
})



// =======================================
