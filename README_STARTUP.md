# 在线教育系统启动指南

## 后端启动步骤：

### 方法1：使用Maven（推荐）
```bash
cd backend
mvn clean compile
mvn spring-boot:run -DskipTests
```

### 方法2：使用批处理文件
```bash
cd backend
start.bat
```

### 方法3：如果Maven有问题，手动启动
```bash
cd backend
java -cp "target/classes;%USERPROFILE%\.m2\repository\*" com.education.system.EducationSystemApplication
```

## 前端启动步骤：
```bash
cd frontend
npm install
npm run dev
```

## 验证步骤：

1. **后端验证**：
   - 访问 http://localhost:8080/api/auth/login （应该返回405 Method Not Allowed，这是正常的）
   - 访问 http://localhost:8080/h2-console （H2数据库控制台）

2. **前端验证**：
   - 访问 http://localhost:5173
   - 使用测试账户登录：
     - 教师：teacher1 / password123  
     - 学生：student1 / password123

## 如果仍然登录失败，检查：

1. **浏览器开发者工具**：
   - F12 -> Network 标签
   - 查看登录请求是否发送到 http://localhost:8080/api/auth/login
   - 检查响应状态码和错误信息

2. **后端日志**：
   - 查看控制台输出的错误信息
   - 特别关注Spring Security和数据库相关的日志

3. **常见错误**：
   - CORS错误：检查后端CORS配置
   - 404错误：检查API路径是否正确
   - 500错误：检查后端日志中的具体错误

## 测试账户预设

应用启动后，DataInitializer会自动创建测试账户：
- teacher1/password123 (教师角色)
- student1/password123 (学生角色)