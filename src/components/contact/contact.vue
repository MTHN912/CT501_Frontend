<template>
  <div class="contact-page">
    <h1 class="contact-header">Liên hệ với chúng tôi</h1>

    <div class="contact-content">
      <div class="contact-info">
        <h2>Thông tin liên hệ</h2>
        <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận X, Thành phố Y</p>
        <p><strong>Số điện thoại:</strong> 0123 456 789</p>
        <p><strong>Email:</strong> contact@restaurant.com</p>
      </div>

      <div class="contact-form">
        <h2>Gửi tin nhắn</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">Tên của bạn:</label>
            <input type="text" id="name" v-model="formData.name" required />
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="formData.email" required />
          </div>

          <div class="form-group">
            <label for="message">Tin nhắn:</label>
            <textarea id="message" v-model="formData.message" required />
          </div>

          <button type="submit" class="submit-btn">Gửi</button>
        </form>
      </div>
    </div>

    <div class="map-container">
      <h2>Bản đồ</h2>
      <iframe
        title="Google Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.795143614253!2d106.654425!3d10.762622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ1JzQ1LjAiTiAxMDbCsDM5JzEwLjAiRQ!5e0!3m2!1sen!2s!4v1635722346627!5m2!1sen!2s"
        width="100%"
        height="400"
        style="border: 0"
        allowfullscreen=""
        loading="lazy"
      >
      </iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: "",
        email: "",
        message: "",
      },
    };
  },
  methods: {
    handleSubmit() {
      // Xử lý form (ví dụ: gửi qua API)
      console.log(this.formData);
      alert("Cảm ơn bạn đã liên hệ với chúng tôi!");
      // Sau đó reset form
      this.formData = {
        name: "",
        email: "",
        message: "",
      };
    },
  },
};
</script>

<style scoped>
/* Căn chỉnh trang */
.contact-page {
  margin-top: 100px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Tiêu đề chính */
.contact-header {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5em;
  color: #333;
}

/* Bố cục 2 cột chính: thông tin liên hệ và form */
.contact-content {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 50px;
}

.contact-info {
  flex: 1;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.contact-info h2 {
  font-size: 1.8em;
  margin-bottom: 20px;
}

.contact-info p {
  font-size: 1.1em;
  margin: 10px 0;
}

/* Form liên hệ */
.contact-form {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.contact-form h2 {
  font-size: 1.8em;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  height: 150px;
}

/* Button */
.submit-btn {
  padding: 12px 20px;
  background-color: #d63c27;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #a52e20;
}

/* Bản đồ */
.map-container {
  margin-top: 50px;
  text-align: center;
}

.map-container iframe {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
