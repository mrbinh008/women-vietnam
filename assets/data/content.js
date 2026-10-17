// Editable default content. Loaded before app.js.
const LETTER_PRESETS = {
    romantic: `Em yêu ơiii, hôm nay là ngày 20/10, ngày dành cho những người phụ nữ tuyệt vời nhất, và tất nhiên, anh không thể quên gửi những lời yêu thương ngọt ngào nhất đến cô công chúa bé nhỏ mà anh thương nhất trên đời rùiii.\n\nEm biết không, từ ngày có em xuất hiện, thế giới của anh dường như trở nên dịu dàng và ấm áp hơn rất nhiều. Anh chẳng biết phải dùng bao nhiêu lời yêu thương mới có thể nói hết được rằng anh may mắn đến nhường nào khi có em bên cạnh. Giữa biết bao nhiêu người ngoài kia, chúng mình lại tìm thấy nhau, được yêu thương, được quan tâm và cùng nhau chia sẻ những điều nhỏ bé trong cuộc sống. Với anh, đó chính là một trong những điều tuyệt vời nhất mà cuộc đời đã dành tặng.\n\nEm yêu à, anh biết đôi khi cuộc sống có những ngày khiến em mệt mỏi, có những chuyện làm em buồn hay phải suy nghĩ thật nhiều. Nhưng anh mong em luôn nhớ rằng, dù ngoài kia có bao nhiêu bộn bề đi chăng nữa, thì vẫn luôn có một chàng trai thương em rất nhiều, luôn muốn lắng nghe những câu chuyện nhỏ xíu của em, muốn dỗ dành em mỗi khi em buồn, muốn nhìn thấy em cười thật tươi mỗi ngày. Em không cần lúc nào cũng phải mạnh mẽ đâu nè, vì bên cạnh em vẫn còn có anh màaa.\n\nNhân ngày Phụ nữ Việt Nam 20/10, anh chúc công chúa của anh luôn thật xinh tươi, khỏe mạnh, vui vẻ và được yêu thương thật nhiều. Mong rằng những điều dịu dàng nhất sẽ luôn tìm đến em, những muộn phiền sẽ nhanh chóng qua đi, và mỗi sáng thức dậy em đều có thêm một lý do để mỉm cười. Anh mong mọi ước mơ bé xinh của em sẽ dần trở thành hiện thực, mong em luôn được sống đúng với những điều mình yêu thích và chẳng bao giờ phải chịu những tủi thân một mình.\n\nAnh không dám hứa rằng ngày nào cũng sẽ là một ngày thật hoàn hảo, nhưng anh hứa sẽ luôn cố gắng để mỗi ngày có anh đều là một ngày em cảm thấy được yêu thương. Anh muốn cùng em đi qua thật nhiều mùa 20/10 nữa, cùng nhau ăn những món ngon, đi đến những nơi mình thích, kể cho nhau nghe đủ thứ chuyện trên đời và gom góp thật nhiều kỷ niệm nhỏ xinh của hai đứa mình.\n\nCảm ơn em vì đã đến, đã ở lại, đã kiên nhẫn với một chàng trai đôi khi còn vụng về như anh. Cảm ơn em vì đã cho anh biết cảm giác được yêu thương một người thật lòng lại bình yên và hạnh phúc đến thế. Nếu được ước một điều trong ngày hôm nay, anh chỉ ước cô công chúa của anh sẽ luôn hạnh phúc, không chỉ riêng ngày 20/10 mà là tất cả những ngày tháng sau này nữa.\n\nChúc mừng ngày 20/10, công chúa đáng yêu nhất trong lòng anhhh! 🌷💗\n\nEm cứ việc làm một em bé thật hạnh phúc nhé, còn việc yêu thương, dỗ dành và cưng chiều em thì cứ để anh lo nèee.\n\nAnh thương em nhiều lắmmm, nhiều hơn cả những gì anh có thể viết thành lời luôn đoáaa. Mãi là em bé được yêu thương thật nhiều của anh nhéee! 🥺💕`,
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
        {
            id: 0,
            title: 'Bữa Tối Lãng Mạn',
            desc: '1 buổi hẹn hò ăn bất cứ món ngon nào em thích, anh bao trọn gói!',
            icon: '🍽️',
            opened: false
        },
        {
            id: 1,
            title: 'Matcha & Ôm Thật Chặt',
            desc: '1 ly matcha full topping kèm 100 cái ôm ấm áp bất cứ lúc nào em gọi!',
            icon: '🍵',
            opened: false
        },
        {
            id: 2,
            title: 'Đặc Quyền Chiều Chuộng 24/7',
            desc: '1 ngày anh làm theo mọi điều em muốn, massage vai và lắng nghe em tâm sự!',
            icon: '👑',
            opened: false
        }
    ],
    reasons: [
        {
            category: 'Nụ cười của em',
            text: '"Anh yêu cách em mỉm cười mỗi khi nhìn thấy món ăn ngon, vừa hồn nhiên vừa đáng yêu khiến anh chỉ muốn ngắm nhìn mãi."'
        },
        {
            category: 'Sự dịu dàng',
            text: '"Anh yêu giọng nói ấm áp của em mỗi khi hỏi thăm anh sau một ngày dài làm việc mệt mỏi."'
        },
        {
            category: 'Ánh mắt lấp lánh',
            text: '"Khi em hào hứng kể về điều em thích, đôi mắt em sáng lấp lánh như cả bầu trời sao."'
        },
        {
            category: 'Sự thấu hiểu',
            text: '"Cảm ơn em vì luôn kiên nhẫn, bao dung và làm cho anh muốn trở thành phiên bản tốt hơn mỗi ngày."'
        },
        {
            category: 'Những cái nắm tay',
            text: '"Chỉ cần nắm tay em đi dạo phố không mục đích, mọi lo âu trong anh đều tự nhiên tan biến."'
        },
        {
            category: 'Bình yên của anh',
            text: '"Giữa thế giới rộng lớn hàng tỷ người, ở bên cạnh em là nơi duy nhất anh thấy bình yên trọn vẹn."'
        },
        {
            category: 'Tương lai chúng mình',
            text: '"Anh yêu từng kế hoạch nhỏ mà hai đứa mình cùng mơ ước và vun đắp cho ngày mai."'
        }
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
