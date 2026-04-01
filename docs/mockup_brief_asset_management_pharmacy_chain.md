# PRD / UX Brief - Web App Quản Lý Tài Sản & Vận Hành Sự Cố Cho Chuỗi Nhà Thuốc

## 1. Mục tiêu tài liệu
Tài liệu này dùng làm đầu vào cho AI Agent / AI UI Generator để tạo **mockup giao diện** cho một **web app quản lý tài sản** dành cho chuỗi nhà thuốc.

Mục tiêu của sản phẩm:
- Quản lý **toàn bộ tài sản** tại từng quầy thuốc theo **từng đơn vị riêng lẻ**
- Cho phép **tra cứu bằng QR code** hoặc **tìm kiếm thủ công**
- Hỗ trợ **kiểm kê định kỳ**
- Hỗ trợ **báo hỏng / đề nghị sửa chữa**
- Hỗ trợ **quản lý task xử lý sự cố**
- Hỗ trợ **SLA / cảnh báo trễ hạn / escalation**
- Hỗ trợ **ảnh minh chứng trước - trong - sau**
- Hỗ trợ **quầy xác nhận hoàn tất**
- Tối ưu trải nghiệm trên **điện thoại di động**

---

## 2. Bối cảnh nghiệp vụ

Chuỗi nhà thuốc có nhiều quầy thuốc.  
Mỗi quầy có rất nhiều loại tài sản khác nhau, ví dụ:
- Quầy, kệ, tủ, bàn, ghế
- CPU, màn hình, bàn phím, chuột, máy in, máy quét mã vạch
- Camera, router, thiết bị mạng
- Điều hòa
- Ống nước, bồn rửa chén, vòi nước
- Hệ thống điện nước, hạ tầng cố định
- Các tài sản kỹ thuật và hạng mục hỗ trợ vận hành khác

### Nguyên tắc cốt lõi
- **1 tài sản = 1 mã riêng = 1 hồ sơ riêng**
- Cùng một loại tài sản nhưng nhiều cái thì mỗi cái vẫn có mã khác nhau
- Ví dụ: 3 cái kệ = 3 mã tài sản
- Mọi sửa chữa, thay thế, điều chuyển, kiểm kê đều phải gắn với đúng mã tài sản

---

## 3. Nền tảng sản phẩm

Xây dựng dưới dạng **web app**.

### Yêu cầu nền tảng
- Dùng tốt trên **điện thoại**
- Dùng tốt trên **desktop**
- Có thể mở trực tiếp bằng trình duyệt
- Khi quét QR bằng điện thoại thì mở đúng trang chi tiết tài sản
- UI ưu tiên thao tác nhanh tại hiện trường

### Định hướng UX
- Mobile-first hoặc mobile-friendly
- Nút bấm lớn, dễ thao tác
- Tối giản bước nhập liệu
- Tốc độ vào màn hình rất nhanh
- Dễ dùng cho nhân viên quầy, nhân viên kiểm kê, bộ phận vận hành

---

## 4. Các vai trò người dùng

### 4.1. Nhân viên quầy
Quyền chính:
- Đăng nhập
- Xem tài sản thuộc quầy mình
- Quét QR để xem tài sản
- Tìm kiếm tài sản
- Tạo phiếu báo hỏng / đề nghị sửa chữa
- Đính kèm ảnh sự cố
- Theo dõi tiến độ xử lý
- Xem comment của bộ phận vận hành
- Xác nhận công việc đã hoàn tất hoặc từ chối xác nhận
- Nhận notification liên quan đến task của mình

### 4.2. Nhân viên kiểm kê
Quyền chính:
- Xem danh sách quầy được giao kiểm kê
- Xem danh sách tài sản cần kiểm kê
- Quét QR khi kiểm kê
- Cập nhật trạng thái tài sản
- Ghi chú bất thường
- Chụp ảnh minh chứng
- Hoàn tất biên bản kiểm kê

### 4.3. Bộ phận vận hành
Quyền chính:
- Xem danh sách task sự cố
- Tiếp nhận task
- Phân loại mức độ sự cố
- Cập nhật trạng thái xử lý
- Ghi comment theo dòng thời gian
- Đính kèm ảnh trước / trong / sau
- Chọn phương án xử lý
- Tự sửa / thay thế vật tư / thuê ngoài
- Cập nhật chi phí dự kiến và chi phí thực tế
- Chuyển task sang trạng thái chờ quầy xác nhận

### 4.4. Trưởng bộ phận vận hành / quản lý
Quyền chính:
- Theo dõi SLA
- Theo dõi task trễ hạn
- Nhận cảnh báo escalation
- Phân công người xử lý
- Xem dashboard tổng hợp
- Theo dõi hiệu suất
- Theo dõi chi phí sửa chữa
- Theo dõi dữ liệu tài sản số hóa
- Duyệt một số phương án / chi phí lớn nếu cần

### 4.5. Admin hệ thống
Quyền chính:
- Quản lý user
- Quản lý vai trò / phân quyền
- Quản lý danh mục quầy
- Quản lý danh mục tài sản
- Quản lý cấu hình SLA
- Quản lý danh mục loại sự cố
- Quản lý danh mục vật tư
- Quản lý trạng thái
- Quản lý notification template

---

## 5. Danh sách module chính

### 5.1. Module Đăng nhập / Hồ sơ người dùng
Màn hình cần có:
- Login
- Quên mật khẩu
- Hồ sơ cá nhân
- Đổi mật khẩu

### 5.2. Module Quản lý quầy thuốc
Màn hình cần có:
- Danh sách quầy
- Chi tiết quầy
- Tài sản thuộc quầy
- Lịch sử kiểm kê của quầy
- Lịch sử sự cố / sửa chữa của quầy

### 5.3. Module Quản lý tài sản
Màn hình cần có:
- Danh sách tài sản
- Bộ lọc theo quầy / loại tài sản / trạng thái
- Tìm kiếm tài sản
- Tạo mới tài sản
- Chi tiết tài sản
- Lịch sử tài sản
- In / xem QR
- Điều chuyển tài sản
- Cập nhật trạng thái tài sản

### 5.4. Module Kiểm kê
Màn hình cần có:
- Danh sách kỳ kiểm kê
- Tạo đợt kiểm kê
- Danh sách quầy trong kỳ kiểm kê
- Màn hình kiểm kê từng tài sản
- Màn hình quét QR khi kiểm kê
- Màn hình xác nhận hàng loạt
- Biên bản kiểm kê
- Báo cáo chênh lệch / bất thường

### 5.5. Module Báo hỏng / đề nghị sửa chữa
Màn hình cần có:
- Tạo phiếu báo hỏng
- Chọn tài sản
- Mô tả sự cố
- Chọn mức độ ưu tiên / cấp độ sự cố
- Chụp ảnh hiện trạng
- Gửi phiếu

### 5.6. Module Task vận hành
Màn hình cần có:
- Danh sách task
- Kanban task theo trạng thái
- Chi tiết task
- Timeline comment
- Đính kèm ảnh
- Cập nhật trạng thái
- Phân công người xử lý
- Cập nhật phương án xử lý
- Cập nhật chi phí
- Chuyển chờ quầy xác nhận
- Xác nhận hoàn tất

### 5.7. Module Notification
Màn hình cần có:
- Notification center
- Danh sách thông báo
- Thông báo chưa đọc / đã đọc
- Click vào notification để mở đúng đối tượng liên quan
- Cấu hình loại thông báo
- Badge số lượng chưa đọc

### 5.8. Module Báo cáo / Dashboard
Màn hình cần có:
- Dashboard tổng quan tài sản
- Dashboard sự cố
- Dashboard SLA
- Dashboard task trễ hạn
- Dashboard chi phí sửa chữa
- Dashboard kiểm kê
- Dashboard hiệu suất vận hành

### 5.9. Module Danh mục & cấu hình
Màn hình cần có:
- Danh mục loại tài sản
- Danh mục nhóm tài sản
- Danh mục trạng thái tài sản
- Danh mục loại sự cố
- Danh mục vật tư
- Cấu hình SLA
- Cấu hình escalation
- Cấu hình quyền hạn / vai trò

---

## 6. Luồng nghiệp vụ chính

### 6.1. Luồng tra cứu tài sản bằng QR
1. Người dùng mở điện thoại
2. Quét QR trên tài sản
3. Web app mở trang chi tiết tài sản
4. Người dùng xem:
   - mã tài sản
   - tên tài sản
   - quầy đang sử dụng
   - trạng thái
   - ảnh
   - lịch sử sửa chữa
   - lịch sử kiểm kê
5. Có thể thao tác nhanh:
   - báo hỏng
   - xác nhận kiểm tra
   - xem lịch sử

### 6.2. Luồng tìm kiếm tài sản
1. Người dùng mở màn hình tìm kiếm
2. Nhập mã tài sản / tên tài sản / quầy / từ khóa
3. Hệ thống trả về danh sách kết quả
4. Người dùng chọn đúng tài sản
5. Mở chi tiết tài sản

### 6.3. Luồng kiểm kê định kỳ
1. Admin hoặc quản lý tạo kỳ kiểm kê
2. Phân công quầy / người kiểm kê
3. Nhân viên kiểm kê tới quầy
4. Mở danh sách tài sản của quầy
5. Quét QR hoặc tìm kiếm thủ công
6. Xác nhận từng tài sản:
   - có mặt / không có mặt
   - hoạt động tốt / hỏng / cần sửa / không sử dụng
7. Ghi chú và chụp ảnh nếu có bất thường
8. Hoàn tất biên bản kiểm kê

### 6.4. Luồng báo hỏng / tạo yêu cầu sửa chữa
1. Nhân viên quầy đăng nhập
2. Tìm tài sản
3. Nhấn nút “Báo hỏng”
4. Chọn cấp độ sự cố
5. Nhập mô tả
6. Chụp ảnh hiện trạng
7. Gửi yêu cầu
8. Hệ thống tạo task cho bộ phận vận hành
9. Gửi notification tới bộ phận vận hành

### 6.5. Luồng xử lý task vận hành
1. Bộ phận vận hành nhận task
2. Tiếp nhận
3. Cập nhật phương án:
   - tự làm
   - thay vật tư
   - thuê ngoài
4. Nếu cần thì cập nhật chi phí dự kiến
5. Trong quá trình xử lý:
   - cập nhật comment
   - cập nhật trạng thái
   - chụp ảnh trong quá trình làm
6. Sau khi xử lý xong:
   - cập nhật ảnh sau xử lý
   - chuyển trạng thái sang “Chờ quầy xác nhận”
7. Nhân viên quầy đăng nhập
8. Xem kết quả
9. Xác nhận hoàn tất hoặc từ chối xác nhận
10. Nếu xác nhận -> task đóng hoàn toàn

### 6.6. Luồng escalation
1. Task được tạo
2. Hệ thống gắn SLA theo loại sự cố
3. Nếu tới mốc mà chưa có cập nhật:
   - cảnh báo nội bộ
   - đánh dấu có nguy cơ trễ
4. Nếu quá hạn:
   - đánh dấu trễ hạn
   - gửi notification tới cấp cao hơn
   - hiển thị nổi bật trên dashboard
5. Nếu cần:
   - đề xuất thuê ngoài
   - chuyển người phụ trách

---

## 7. Phân loại cấp độ sự cố

### Mức 1 - Gấp
Ảnh hưởng trực tiếp đến bán hàng hoặc an toàn
Ví dụ:
- Mất điện toàn quầy
- Máy tính lỗi không bán hàng được
- Máy in hóa đơn hỏng
- Rò rỉ nước lớn gây ngập
- Camera mất kết nối hoàn toàn
- Hỏng cửa cuốn
- Lỗi có nguy cơ pháp lý / GPP

### Mức 2 - Bình thường
Ảnh hưởng đến trải nghiệm hoặc vận hành phụ
Ví dụ:
- Điều hòa không mát
- Tắc lavabo nhẹ
- Chuột / bàn phím chập chờn
- Hỏng bóng đèn phụ
- Rò rỉ nhỏ

### Mức 3 - Cải thiện
Ảnh hưởng thẩm mỹ hoặc mức nhẹ
Ví dụ:
- Bong decal
- Cửa tủ xệ
- Kính nứt nhẹ
- Dây điện chưa gọn
- Hạng mục cải thiện hình ảnh

---

## 8. SLA đề xuất cho mockup

### Theo tài liệu nghiệp vụ vận hành
- Mức 1:
  - phản hồi trong 1 giờ
  - hoàn thành trong 8 giờ hoặc trước ca sáng hôm sau
- Mức 2 / Mức 3:
  - phản hồi trong 4 giờ
  - hoàn thành trong 48 giờ hoặc theo lộ trình kế hoạch

### Trạng thái SLA cần hiển thị
- Trong hạn
- Sắp quá hạn
- Quá hạn
- Đã escalate

---

## 9. Notification - phạm vi cần thiết kế

Notification dùng để báo cho user biết:
- Có việc mới liên quan đến mình
- Có task được giao cho mình
- Có task mình tạo đã được cập nhật
- Có task chờ mình xác nhận
- Task của mình bị từ chối / bị trả lại
- Task bị trễ hạn
- Có đợt kiểm kê mới
- Có quầy hoặc tài sản liên quan tới mình cần xử lý

### Các loại notification chính
1. Có task mới
2. Task được phân công cho bạn
3. Task được cập nhật comment
4. Task chuyển trạng thái
5. Task chờ quầy xác nhận
6. Task bị quá hạn / trễ SLA
7. Kỳ kiểm kê mới
8. Tài sản mới điều chuyển về quầy
9. Yêu cầu của bạn đã hoàn tất
10. Yêu cầu của bạn bị từ chối xác nhận

### UI notification nên có
- Icon chuông ở header
- Badge số lượng chưa đọc
- Dropdown preview
- Trang Notification Center riêng
- Filter theo:
  - chưa đọc
  - task
  - kiểm kê
  - tài sản
  - hệ thống
- Click 1 notification -> đi tới đúng màn hình chi tiết liên quan

---

## 10. Danh sách màn hình mockup cần tạo

## A. Auth
1. Login
2. Quên mật khẩu
3. Hồ sơ cá nhân

## B. Dashboard
4. Dashboard nhân viên quầy
5. Dashboard bộ phận vận hành
6. Dashboard quản lý

## C. Quầy thuốc
7. Danh sách quầy
8. Chi tiết quầy
9. Tài sản thuộc quầy
10. Lịch sử sự cố của quầy

## D. Tài sản
11. Danh sách tài sản
12. Chi tiết tài sản
13. Tạo / sửa tài sản
14. In / xem QR
15. Điều chuyển tài sản
16. Lịch sử tài sản

## E. Kiểm kê
17. Danh sách kỳ kiểm kê
18. Tạo kỳ kiểm kê
19. Danh sách quầy cần kiểm kê
20. Màn hình kiểm kê theo quầy
21. Màn hình quét QR khi kiểm kê
22. Biên bản kiểm kê

## F. Sự cố / sửa chữa
23. Tạo phiếu báo hỏng
24. Danh sách phiếu báo hỏng
25. Chi tiết phiếu báo hỏng

## G. Task vận hành
26. Danh sách task dạng table
27. Danh sách task dạng kanban
28. Chi tiết task
29. Màn hình cập nhật trạng thái
30. Màn hình thêm comment + ảnh
31. Màn hình xác nhận hoàn tất từ quầy

## H. Notification
32. Notification dropdown
33. Notification center
34. Chi tiết notification / deep link state

## I. Báo cáo
35. Dashboard SLA
36. Dashboard chi phí sửa chữa
37. Dashboard kiểm kê
38. Dashboard tài sản bất thường

## J. Admin / config
39. Quản lý user
40. Quản lý role
41. Danh mục loại tài sản
42. Danh mục loại sự cố
43. Cấu hình SLA
44. Cấu hình escalation
45. Cấu hình notification

---

## 11. Cấu trúc dữ liệu hiển thị trong mockup

### 11.1. Asset Card / Asset Detail
- Mã tài sản
- Tên tài sản
- Nhóm tài sản
- Quầy
- Khu vực trong quầy
- Loại mã: QR / mã thường
- Trạng thái
- Ảnh tài sản
- Ngày lắp đặt / ghi nhận
- Người phụ trách
- Ghi chú
- Lịch sử sửa chữa
- Lịch sử kiểm kê
- Tổng chi phí sửa chữa

### 11.2. Repair Ticket / Task
- Mã task
- Mã phiếu báo hỏng
- Tài sản
- Quầy
- Người tạo
- Cấp độ sự cố
- Mức ưu tiên
- Trạng thái
- SLA phản hồi
- SLA hoàn thành
- Người phụ trách
- Phương án xử lý
- Chi phí dự kiến
- Chi phí thực tế
- Ảnh trước
- Ảnh trong
- Ảnh sau
- Comment timeline
- Kết quả xác nhận từ quầy

### 11.3. Inventory Record
- Mã kỳ kiểm kê
- Quầy
- Người kiểm kê
- Ngày kiểm kê
- Danh sách tài sản
- Kết quả từng tài sản
- Ghi chú
- Ảnh minh chứng
- Tổng hợp tốt / hỏng / thiếu / không tìm thấy

---

## 12. Gợi ý style UI cho AI Agent

### Tone giao diện
- Hiện đại
- Chuyên nghiệp
- Dễ đọc
- Tối ưu thao tác hiện trường
- Không quá nhiều chi tiết rối

### Màu sắc
- Tông sáng
- Có trạng thái rõ:
  - Xanh lá = tốt / hoàn tất
  - Vàng = chờ xử lý / sắp quá hạn
  - Đỏ = gấp / lỗi / trễ hạn
  - Xám = lưu trữ / ngưng dùng

### Component nên ưu tiên
- Card summary
- Table có filter
- Kanban board
- Timeline comment
- Image uploader / image preview
- QR scan entry point
- Floating action button trên mobile
- Sticky bottom actions trên mobile

### Responsive
- Desktop: nhiều bảng, dashboard
- Mobile: card list, action sheet, sticky CTA
- Ưu tiên thao tác một tay

---

## 13. Yêu cầu rất quan trọng cho AI Agent khi sinh mockup

AI Agent cần tạo mockup theo các nguyên tắc sau:

1. Đây là **web app**, không phải app native
2. Phải có phiên bản **mobile usable**
3. Mockup phải thể hiện rõ:
   - asset management
   - inspection / inventory
   - issue reporting
   - maintenance task management
   - notification
4. Task chỉ được đóng hoàn toàn sau khi **quầy xác nhận**
5. Ảnh minh chứng trước và sau là thành phần bắt buộc trong flow xử lý
6. Notification phải là module riêng, không chỉ là icon minh họa
7. SLA / trễ hạn / escalation phải được thể hiện trực quan
8. Tài sản có thể tra cứu bằng QR hoặc search
9. Hệ thống phải hỗ trợ cả tài sản điện tử lẫn hạ tầng cố định
10. Mockup cần đủ rõ để mang đi trao đổi tiếp với khách hàng

---

## 14. Prompt mẫu để tiếp tục đưa cho AI UI Generator

Hãy thiết kế mockup giao diện cho một web app quản lý tài sản dành cho chuỗi nhà thuốc.

Bối cảnh:
- Mỗi quầy thuốc có nhiều tài sản
- Mỗi tài sản được quản lý theo từng đơn vị riêng lẻ bằng mã tài sản / QR
- Có kiểm kê định kỳ
- Có báo hỏng, sửa chữa, thay thế, thuê ngoài
- Có task vận hành với SLA, comment timeline, ảnh trước/sau
- Có bước quầy xác nhận thì task mới hoàn tất
- Có notification center
- Phải chạy tốt trên điện thoại

Hãy tạo:
- sitemap
- user flow
- wireframe
- high-fidelity mockup cho các màn hình quan trọng nhất
- phiên bản desktop và mobile cho các màn hình chính

Ưu tiên mockup cho các màn hình:
- dashboard
- danh sách tài sản
- chi tiết tài sản
- tạo báo hỏng
- chi tiết task vận hành
- xác nhận hoàn tất từ quầy
- notification center
- kiểm kê bằng QR trên mobile

---

## 15. Kết luận
Đây không chỉ là hệ thống quản lý tài sản đơn thuần, mà là hệ thống:
- quản lý tài sản
- quản lý kiểm kê
- quản lý sự cố
- quản lý sửa chữa / thay thế
- quản lý task vận hành
- quản lý SLA
- quản lý notification
- quản lý bằng chứng số
- quản lý nghiệm thu từ hiện trường
