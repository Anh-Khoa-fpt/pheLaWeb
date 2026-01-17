# Matte Matcha & Teabar Web

Phiên bản web này giới thiệu trải nghiệm order nước tại Matte Matcha & Teabar Quận 1: chỉ cần mở link, quét QR từng ly matcha/Teabar, thêm vào giỏ và thanh toán thử nghiệm ngay trên trình duyệt.

- Xem nhanh thực đơn matcha latte, Teabar signature, soda trà và dessert.
- Thêm món, thay đổi số lượng, gạt qua gạt lại giữa các lựa chọn mà không cần reload.
- Nhấn **Đặt hàng** để chọn cổng thanh toán phù hợp (MoMo sandbox hoặc mô phỏng ngân hàng).
- MoMo QR tạo mã từ sandbox API, trình duyệt sẽ hiện QR hoặc mở app MoMo nếu bạn bấm “Mở MoMo”.
- “Thanh toán ngân hàng” là trải nghiệm mô phỏng: hiển thị QR tĩnh, đếm 30 giây rồi báo thành công và lưu đơn vào lịch sử để tham khảo.
- Lịch sử đơn hàng nằm trong menu header, lưu tối đa 20 đơn gần nhất từ các thanh toán ngân hàng.

## Hướng dẫn cho người mới

1. **Mở link web** → trang Home hiện banner Matte Matcha & Teabar cùng thông tin thương hiệu.
2. **Duyệt đồ uống** qua phần “Thực đơn” hoặc “Đồ uống gợi ý”, bấm “Thêm vào giỏ” để gom món.
3. **Mở giỏ** bằng biểu tượng 🛒 trên header, kiểm tra số lượng, bấm “Đặt hàng”.
4. **Chọn MoMo** để tạo QR sandbox, quét bằng app MoMo hoặc bấm “Mở MoMo” nếu trình duyệt hỗ trợ.
5. **Chọn Ngân hàng** nếu bạn muốn trải nghiệm mô phỏng mã QR – hệ thống sẽ đếm 30 giây, báo thành công và xóa giỏ hàng.
6. **Xem lịch sử đơn** từ menu: chỉ lưu đơn đã xác nhận bằng ngân hàng (không lưu MoMo).

## Những điều lưu ý

- **Không cần đăng nhập:** toàn bộ trải nghiệm khách mở link đều có thể order ngay.
- **Lịch sử đơn hàng:** lưu bên trên thiết bị (localStorage). Xóa cache hay đổi thiết bị sẽ mất dữ liệu.
- **QR MoMo:** chạy sandbox, thích hợp để demo; mã QR hết hạn sau vài phút nếu không quét lại.
- **Thanh toán ngân hàng:** chỉ mô phỏng, để khách thử cảm giác; không xác nhận trên hệ thống ngân hàng thật.
- **Giỏ hàng tự xoá** sau khi thanh toán thành công.

