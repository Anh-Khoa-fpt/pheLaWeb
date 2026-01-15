# Phê La Order Web

Đây là phiên bản web (đã deploy trên Vercel) của trải nghiệm order nước Phê La. Không cần cài gì, chỉ cần gửi cho khách hàng đường dẫn trên Vercel là họ có thể:

- Xem danh sách sản phẩm được gợi ý cùng ảnh, tên, giá từng loại.
- Thêm sản phẩm vào giỏ và điều chỉnh số lượng trực tiếp trong giao diện.
- Nhấn nút “Đặt hàng” để mở modal chọn phương thức thanh toán.
- Dùng MoMo QR: hệ thống gọi API MoMo sandbox và hiện mã QR trên màn hình. Bạn có thể quét hoặc dùng nút “Mở MoMo” để chuyển sang app.
- Dùng “Thanh toán bằng ngân hàng” giả lập: sẽ hiện ảnh mã QR tĩnh, sau 30 giây tự đóng, xóa giỏ hàng và chuyển về trang chủ kèm thông báo.
- Xem lại lịch sử các đơn hàng vừa thanh toán bằng ngân hàng từ menu header (“Lịch sử đặt hàng”).

## Hướng dẫn dùng (dành cho người không chuyên)

1. **Truy cập link Vercel** → sẽ vào thẳng trang Home với banner và vài lời giới thiệu.
2. **Duyệt sản phẩm** bằng cách bấm vào từng thẻ rồi nhấn “Thêm vào giỏ”. Giỏ hàng nằm ở góc trên cùng (hình 🛒).
3. **Mở giỏ** bằng nút “Giỏ hàng” hoặc biểu tượng Ơ trên header. Kiểm tra số lượng, bấm “Đặt hàng” để chọn phương thức.
4. **Chọn MoMo** nếu bạn muốn chạy sandbox QR: hệ thống sẽ hiển thị mã, tiếp theo quét bằng app MoMo hoặc bấm “Mở MoMo” (không thanh toán được vì cần thêm quyền từ momo).
5. **Chọn Ngân hàng** để xem mô phỏng thanh toán bằng hình ảnh QR, chờ 30s để xong – web sẽ báo thành công và đưa bạn về trang chủ. THANH TOÁN BẰNG NÀY THÌ HÀNG ĐÃ ORDER SẼ ĐƯỢC LƯU LẠI CÒN MOMO THÌ KHÔNG.
6. **Xem lịch sử đơn** từ menu (góc phải trên cùng): nó lưu lại tối đa 20 đơn vừa thanh toán bằng ngân hàng để bạn kiểm tra lại.

## Những điều nên biết

- **Không cần đăng nhập:** toàn bộ trải nghiệm dành cho khách hàng mở link nên bạn không phải điền email hay mật khẩu.
- **Lịch sử đơn hàng:** chỉ lưu tại thiết bị (localStorage). Nếu bạn xoá cache hoặc chuyển thiết bị khác thì lịch sử sẽ mất.
- **QR MoMo:** chạy sandbox nên chỉ để thử nghiệm; link sẽ đóng sau vài phút nếu không quét. Đảm bảo người dùng tạo lại đơn để có mã mới.
- **Thanh toán ngân hàng:** chỉ là mô phỏng (hiện ảnh mã và mãn thời gian) để khách hàng thấy giao diện; không thực sự xác nhận với ngân hàng.
- **Giỏ hàng tự xoá** sau khi thanh toán thành công, để tránh bị trùng đơn khi thử lại.


