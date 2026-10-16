// Editable default content. Loaded before app.js.
const LETTER_PRESETS = {
  romantic: `Nhân ngày Phụ nữ Việt Nam 20/10, anh muốn gửi đến em tất cả những điều dịu dàng và ngọt ngào nhất trên thế gian này.\n\nCảm ơn em vì đã bước vào cuộc đời anh, mang theo ánh nắng ấm áp và nụ cười khiến trái tim anh luôn bình yên mỗi khi trở về. Dù thế giới ngoài kia có bận rộn thế nào, với anh, em mãi là cô công chúa nhỏ cần được yêu thương, chiều chuộng và chở che.\n\nChúc người yêu của anh một ngày 20/10 ngập tràn hoa thơm, niềm vui và mãi luôn hạnh phúc trong vòng tay anh nhé!`,
  deep: `Hôm nay là ngày 20/10 — ngày tôn vinh những người phụ nữ tuyệt vời, và trong mắt anh, người tuyệt vời nhất chính là em.\n\nĐi cùng em qua những ngày nắng đẹp lẫn những lúc mưa rào, anh càng thêm trân trọng sự thấu hiểu, dịu dàng và kiên nhẫn mà em dành cho chúng mình. Anh không hứa sẽ hái sao trên trời, nhưng anh hứa sẽ luôn nắm chặt tay em, lắng nghe em và cùng em xây dựng một tương lai thật ấm áp.\n\nChúc em yêu ngày 20/10 rạng rỡ và bình yên nhất!`,
  cute: `Ting ting! Thông báo khẩn cấp ngày 20/10 gửi tới cô gái đáng yêu nhất vũ trụ của anh! 🚨💖\n\nHôm nay là ngày của em, nên nhiệm vụ duy nhất của em là: cười thật tươi, mặc thật xinh và chuẩn bị tinh thần nhận thật nhiều cái ôm, trà sữa cùng đồ ăn ngon từ anh!\n\nChúc em bé của anh ngày 20/10 luôn xinh đẹp, không bao giờ buồn phiền và ngày càng yêu anh nhiều hơn hôm qua nha!`,
  poem: `Tháng Mười gió nhẹ ngang qua,\nDành câu chúc ngọt cùng hoa tặng nàng.\nCảm ơn ánh mắt dịu dàng,\nLàm tim anh bỗng ngập tràn nắng xuân.\n\nDù xa hay lúc ở gần,\nThương em trọn vẹn mười phần chẳng vơi.\nHai mươi tháng Mười rạng ngời,\nChúc em hạnh phúc bên đời có anh!`
};

const FLOWER_MEANINGS = [
  {
    emoji: '🌹',
    name: 'Hoa Hồng Phấn — Sự Dịu Dàng & Ngọt Ngào',
    tag: 'Biểu tượng của tình yêu lãng mạn',
    message: '"Giống như cánh hồng phấn dịu êm trong nắng sớm, nụ cười của em luôn làm tan biến mọi mệt mỏi trong anh. Chúc em ngày 20/10 luôn rạng rỡ, kiêu sa như đóa hoa đẹp nhất."'
  },
  {
    emoji: '🌺',
    name: 'Hoa Mẫu Đơn — Vẻ Đẹp Kiêu Sa & Viên Mãn',
    tag: 'Lời chúc hạnh phúc đong đầy',
    message: '"Mẫu đơn tượng trưng cho sự trân quý và hạnh phúc tròn đầy. Với anh, em chính là báu vật quý giá nhất mà anh luôn muốn nâng niu mỗi ngày."'
  },
  {
    emoji: '🌼',
    name: 'Hoa Baby Trắng — Tình Yêu Tinh Khôi & Vĩnh Cửu',
    tag: 'Hàng ngàn vì sao nhỏ bên em',
    message: '"Những bông baby nhỏ xinh như hàng ngàn khoảnh khắc bình yên khi chúng mình bên nhau — giản dị, trong trẻo nhưng chẳng bao giờ phai nhạt."'
  },
  {
    emoji: '🌷',
    name: 'Hoa Tulip Hồng — Lời Hứa Đồng Hành',
    tag: 'Sự quan tâm ấm áp trọn vẹn',
    message: '"Đóa Tulip hồng thay lời anh hứa: dù ngày nắng hay ngày mưa, anh vẫn sẽ luôn là bờ vai vững chãi để em tựa vào bất cứ lúc nào."'
  },
  {
    emoji: '🌻',
    name: 'Hoa Hướng Dương — Ánh Nắng Của Đời Anh',
    tag: 'Luôn hướng về phía em',
    message: '"Nếu hoa hướng dương luôn hướng về mặt trời, thì ánh mắt và trái tim anh cũng chỉ luôn hướng về một mình em mà thôi!"'
  }
];

const DEFAULT_CONTENT = {
  recipientName: 'Em Yêu',
  senderName: 'Anh',
  startDate: '2026-01-18',
  currentPreset: 'romantic',
  letterText: LETTER_PRESETS.romantic,
  heartCount: 2010,
  sweetnessLevel: 1000,
  vouchers: [
    { id: 0, title: 'Bữa Tối Lãng Mạn', desc: '1 buổi hẹn hò ăn bất cứ món ngon nào em thích, anh bao trọn gói!', icon: '🍽️', opened: false },
    { id: 1, title: 'Matcha & Ôm Thật Chặt', desc: '1 ly matcha full topping kèm 100 cái ôm ấm áp bất cứ lúc nào em gọi!', icon: '🧋', opened: false },
    { id: 2, title: 'Đặc Quyền Chiều Chuộng 24/7', desc: '1 ngày anh làm theo mọi điều em muốn, massage vai và lắng nghe em tâm sự!', icon: '👑', opened: false }
  ],
  reasons: [
    { category: 'Nụ cười của em', text: '"Anh yêu cách em mỉm cười mỗi khi nhìn thấy món ăn ngon, vừa hồn nhiên vừa đáng yêu khiến anh chỉ muốn ngắm nhìn mãi."' },
    { category: 'Sự dịu dàng', text: '"Anh yêu giọng nói ấm áp của em mỗi khi hỏi thăm anh sau một ngày dài làm việc mệt mỏi."' },
    { category: 'Ánh mắt lấp lánh', text: '"Khi em hào hứng kể về điều em thích, đôi mắt em sáng lấp lánh như cả bầu trời sao."' },
    { category: 'Sự thấu hiểu', text: '"Cảm ơn em vì luôn kiên nhẫn, bao dung và làm cho anh muốn trở thành phiên bản tốt hơn mỗi ngày."' },
    { category: 'Những cái nắm tay', text: '"Chỉ cần nắm tay em đi dạo phố không mục đích, mọi lo âu trong anh đều tự nhiên tan biến."' },
    { category: 'Nét đáng yêu riêng', text: '"Cả những lúc em hơi dỗi nhẹ rồi lại bật cười ngay khi anh trêu cũng làm tim anh tan chảy."' },
    { category: 'Bình yên của anh', text: '"Giữa thế giới rộng lớn hàng tỷ người, ở bên cạnh em là nơi duy nhất anh thấy bình yên trọn vẹn."' },
    { category: 'Tương lai chúng mình', text: '"Anh yêu từng kế hoạch nhỏ mà hai đứa mình cùng mơ ước và vun đắp cho ngày mai."' }
  ]
};

const DEFAULT_ALBUM_PHOTOS = [
    {
      id: 'p1',
      src: 'assets/images/album-01.JPG',
      title: 'Nụ Cười Tỏa Nắng Bên Vạt Hoa Vàng',
      dateTag: 'Khoảnh khắc ngọt ngào',
      caption: 'Giữa vạt hoa vàng rực rỡ dưới nắng ấm, nụ cười tươi tắn và đôi mắt sau làn kính của em vẫn là điều xinh đẹp nhất làm tim anh rung động mỗi khi ngắm nhìn.',
      favorite: true,
      likes: 204
    },
    {
      id: 'p2',
      src: 'assets/images/album-02.png',
      title: 'Hẹn Hò Xem Phim — "사랑해" Bên Em',
      dateTag: 'Buổi hẹn hò CGV',
      caption: 'Chiếc gương check-in với dòng chữ "사랑해" thay lời anh muốn nói mỗi ngày. Hạnh phúc nhất không phải là xem bộ phim hay thế nào, mà là luôn có em đứng cạnh bên anh.',
      favorite: true,
      likes: 220
    },
    {
      id: 'p3',
      src: 'assets/images/album-03.JPG',
      title: 'Góc Nghiêng Nàng Thơ Của Đời Anh',
      dateTag: 'Nàng thơ kiêu sa',
      caption: 'Ánh mắt trong veo ngước nhìn và nét dịu dàng như hoa sớm mai. Với anh, em không chỉ là người yêu, mà còn là nàng thơ tuyệt mỹ nhất mà cuộc đời đã ưu ái trao tặng.',
      favorite: true,
      likes: 310
    },
    {
      id: 'p4',
      src: 'assets/images/album-04.png',
      title: 'Nét Dịu Dàng Mùa Thu Bên Hồ Gươm',
      dateTag: 'Chiều thu Hà Nội',
      caption: 'Cơn gió thu Hà Nội khẽ làm bay làn tóc, em đứng đó e ấp bên Tháp Rùa cổ kính. Bỗng thấy cả một góc trời thủ đô thu nhỏ lại, vừa vặn dịu dàng trong dáng hình em.',
      favorite: true,
      likes: 256
    },
    {
      id: 'p5',
      src: 'assets/images/album-05.JPG',
      title: 'Bắt Trọn Từng Khoảnh Khắc Hạnh Phúc',
      dateTag: 'Nụ cười rạng rỡ',
      caption: 'Ống kính máy ảnh có thể lưu giữ ngàn vạn khung hình, nhưng với anh, khoảnh khắc rạng rỡ nhất luôn là khi em cười tươi và hạnh phúc như thế này!',
      favorite: true,
      likes: 288
    }
  ];

const HEART_EMOJIS = ['💖', '💗', '🌷', '✨', '🌹', '💝'];
