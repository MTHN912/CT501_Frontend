<template>
  <!-- Introduction Start -->
  <div class="container-fluid py-6 a">
    <div class="container">
      <!-- Phần giới thiệu chính -->
      <div class="row g-5 align-items-center">
        <div class="col-lg-5 wow bounceInUp" data-wow-delay="0.1s">
          <img src="img/c.jpg" class="img-fluid rounded" alt="Introduction" />
        </div>
        <div class="col-lg-7 wow bounceInUp" data-wow-delay="0.3s">
          <small
            class="d-inline-block fw-bold text-dark text-uppercase bg-light border border-primary rounded-pill px-4 py-1 mb-3"
            >Giới thiệu</small
          >
          <h1 class="display-5 mb-4">Chào mừng đến với MTHN Restaurant</h1>
          <p class="mb-4">
            Tại MTHN Restaurant, chúng tôi tin rằng sự kết hợp giữa ẩm thực
            truyền thống và phong cách hiện đại sẽ mang lại trải nghiệm tuyệt
            vời cho quý khách. Với đội ngũ chuyên nghiệp và tận tâm, chúng tôi
            hứa hẹn mang đến cho bạn những bữa ăn không chỉ ngon miệng mà còn
            đầy tính nghệ thuật.
          </p>
          <div class="row g-4 text-dark mb-5">
            <div class="col-sm-6">
              <i class="fas fa-check-circle text-primary me-2"></i>Nguyên liệu
              tươi sạch
            </div>
            <div class="col-sm-6">
              <i class="fas fa-check-circle text-primary me-2"></i>Đầu bếp
              chuyên nghiệp
            </div>
            <div class="col-sm-6">
              <i class="fas fa-check-circle text-primary me-2"></i>Phục vụ tận
              tình
            </div>
            <div class="col-sm-6">
              <i class="fas fa-check-circle text-primary me-2"></i>Không gian
              sang trọng
            </div>
          </div>
          <a
            href="http://localhost:3001/introduction"
            class="btn btn-primary py-3 px-5 rounded-pill"
          >
            Khám phá thêm<i class="fas fa-arrow-right ps-2"></i>
          </a>
        </div>
      </div>

      <!-- Phần Lịch sử hình thành -->
      <div class="row mt-5 align-items-center">
        <div class="col-lg-6">
          <small
            class="d-inline-block fw-bold text-dark text-uppercase bg-light border border-primary rounded-pill px-4 py-1 mb-3"
            >Lịch Sử</small
          >
          <h1 class="text-dark mb-4">Lịch sử của chúng tôi</h1>
          <p class="mb-4">
            MTHN Restaurant được thành lập vào năm 2005 với khát vọng tạo ra một
            không gian ẩm thực độc đáo, nơi khách hàng không chỉ được thưởng
            thức những món ăn ngon mà còn được trải nghiệm phong cách phục vụ
            chuyên nghiệp. Chúng tôi bắt đầu chỉ với một cửa hàng nhỏ tại trung
            tâm thành phố, và qua nhiều năm không ngừng phát triển, giờ đây MTHN
            Restaurant đã trở thành một trong những nhà hàng hàng đầu trong khu
            vực, với nhiều chi nhánh trên khắp cả nước.
          </p>
          <p>
            Trải qua những thử thách và thành công, chúng tôi vẫn giữ vững triết
            lý: "Chất lượng luôn đặt lên hàng đầu". Điều này đã giúp chúng tôi
            không chỉ giành được lòng tin của khách hàng mà còn tạo nên một
            thương hiệu uy tín trong làng ẩm thực.
          </p>
        </div>
        <div class="col-lg-6">
          <img src="img/lichsu.jpg" class="img-fluid rounded b" alt="History" />
        </div>
      </div>

      <!-- Phần Sứ mệnh và Giá trị -->
      <div class="row mt-5 align-items-center">
        <div class="col-lg-6 order-lg-2 d">
          <small
            class="d-inline-block fw-bold text-dark text-uppercase bg-light border border-primary rounded-pill px-4 py-1 mb-3"
            >Sứ Mệnh</small
          >
          <h1 class="text-dark mb-4">Sứ mệnh và Giá trị</h1>
          <p class="mb-4">
            Sứ mệnh của chúng tôi là mang đến cho khách hàng trải nghiệm ẩm thực
            tuyệt vời, kết hợp giữa sự tinh tế của ẩm thực truyền thống và sáng
            tạo hiện đại. Mỗi món ăn của chúng tôi đều được chuẩn bị cẩn thận từ
            những nguyên liệu tươi ngon nhất, mang lại sự hài lòng và thưởng
            thức đặc biệt cho khách hàng.
          </p>
          <p>
            Giá trị cốt lõi của chúng tôi bao gồm sự tận tâm, sáng tạo và chất
            lượng. Chúng tôi không ngừng đổi mới, luôn học hỏi từ những nền ẩm
            thực khác nhau để làm phong phú thêm thực đơn của mình. Đội ngũ nhân
            viên của chúng tôi luôn phục vụ khách hàng với sự chuyên nghiệp và
            lòng nhiệt tình.
          </p>
        </div>
        <div class="col-lg-6 order-lg-1">
          <img
            src="img/b.jpg"
            class="img-fluid rounded bc"
            alt="Mission and Values"
          />
        </div>
      </div>

      <!-- Phần Câu chuyện thương hiệu -->
      <div class="row mt-5 align-items-center">
        <div class="col-lg-6">
          <small
            class="d-inline-block fw-bold text-dark text-uppercase bg-light border border-primary rounded-pill px-4 py-1 mb-3"
            >Câu Chuyện</small
          >
          <h1 class="text-dark mb-4">Câu chuyện của chúng tôi</h1>

          <p class="mb-4">
            MTHN Restaurant không chỉ là nơi bạn đến để ăn uống, mà còn là nơi
            mà chúng tôi truyền tải đam mê và tình yêu với nghệ thuật ẩm thực.
            Câu chuyện của chúng tôi bắt đầu từ một niềm đam mê đơn giản – tình
            yêu đối với những món ăn ngon. Qua nhiều năm, chúng tôi đã biến niềm
            đam mê ấy thành một sứ mệnh lớn lao: đưa MTHN trở thành một biểu
            tượng ẩm thực kết hợp giữa truyền thống và hiện đại.
          </p>
          <p>
            Những món ăn tại MTHN Restaurant được chăm chút tỉ mỉ từ khâu lựa
            chọn nguyên liệu, chế biến cho đến cách trình bày. Chúng tôi tin
            rằng mỗi món ăn không chỉ đơn thuần là một bữa ăn mà là một tác phẩm
            nghệ thuật, mang lại cảm xúc và niềm vui cho khách hàng.
          </p>
        </div>
        <div class="col-lg-6">
          <img src="img/d.jpg" class="img-fluid rounded b" alt="Brand Story" />
        </div>
      </div>
    </div>
  </div>
  <!-- Introduction End -->
</template>

<script>
export default {
  name: "Introduction",
};
</script>

<style scoped>
.a {
  margin-top: 100px;
}
.b {
  margin-top: 20px;
  width: 512px;
  height: 512px;
  margin-left: 70px;
}
.bc {
  margin-top: 20px;
  width: 512px;
  height: 512px;
  margin-right: 70px;
}
.d {
  margin-top: 20px;
  margin-left: -85px;
}
h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

p {
  font-size: 1.1rem;
  line-height: 1.7;
}

.mt-5 {
  margin-top: 3rem;
}

.intro-image {
  max-width: 100%;
  height: 500px;
  /* object-fit: cover; */
  border-radius: 10px;
}

/* Hiệu ứng animation */
.wow {
  animation-duration: 1s;
  animation-fill-mode: both;
}

@keyframes bounceInUp {
  0%,
  60%,
  75%,
  90%,
  100% {
    -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, 3000px, 0);
    transform: translate3d(0, 3000px, 0);
  }
  60% {
    opacity: 1;
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
  }
  75% {
    -webkit-transform: translate3d(0, 10px, 0);
    transform: translate3d(0, 10px, 0);
  }
  90% {
    -webkit-transform: translate3d(0, -5px, 0);
    transform: translate3d(0, -5px, 0);
  }
  100% {
    -webkit-transform: none;
    transform: none;
  }
}
</style>
