package com.education.system;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = EducationSystemApplication.class)
@TestPropertySource(locations = "classpath:application-test.yml")
public class SimpleDataBaseTest {

    @Autowired
    private DataSource dataSource;

    @Test
    public void testDatabaseConnection() {
        System.out.println("=== 简单数据库连接测试 ===");
        
        try (Connection connection = dataSource.getConnection()) {
            assertNotNull(connection, "数据库连接不能为空");
            assertFalse(connection.isClosed(), "数据库连接应该是开启状态");
            
            System.out.println("✅ 数据库连接成功!");
            System.out.println("数据库URL: " + connection.getMetaData().getURL());
            System.out.println("数据库产品: " + connection.getMetaData().getDatabaseProductName());
            System.out.println("数据库版本: " + connection.getMetaData().getDatabaseProductVersion());
            
        } catch (SQLException e) {
            System.err.println("❌ 数据库连接失败: " + e.getMessage());
            e.printStackTrace();
            fail("数据库连接失败: " + e.getMessage());
        }
    }

    @Test
    public void testSimpleQuery() {
        System.out.println("\n=== 简单SQL查询测试 ===");
        
        try (Connection connection = dataSource.getConnection()) {
            // 测试简单查询
            String sql = "SELECT 1 as test_value";
            try (PreparedStatement stmt = connection.prepareStatement(sql);
                 ResultSet rs = stmt.executeQuery()) {
                
                if (rs.next()) {
                    int testValue = rs.getInt("test_value");
                    assertEquals(1, testValue, "查询结果应该是1");
                    System.out.println("✅ 简单查询测试成功! 返回值: " + testValue);
                } else {
                    fail("查询应该返回结果");
                }
            }
            
        } catch (SQLException e) {
            System.err.println("❌ SQL查询失败: " + e.getMessage());
            e.printStackTrace();
            fail("SQL查询失败: " + e.getMessage());
        }
    }

    @Test
    public void testUsersTableExists() {
        System.out.println("\n=== 检查users表是否存在 ===");
        
        try (Connection connection = dataSource.getConnection()) {
            // 检查users表是否存在
            String sql = "SELECT table_name FROM information_schema.tables WHERE table_name = 'users'";
            try (PreparedStatement stmt = connection.prepareStatement(sql);
                 ResultSet rs = stmt.executeQuery()) {
                
                if (rs.next()) {
                    String tableName = rs.getString("table_name");
                    System.out.println("✅ 找到表: " + tableName);
                } else {
                    System.out.println("⚠️  users表不存在，这是正常的，应用启动时会自动创建");
                }
            }
            
        } catch (SQLException e) {
            System.err.println("❌ 检查表失败: " + e.getMessage());
            e.printStackTrace();
            fail("检查表失败: " + e.getMessage());
        }
    }

    @Test
    public void testCreateTestTable() {
        System.out.println("\n=== 测试创建临时表 ===");
        
        try (Connection connection = dataSource.getConnection()) {
            // 创建临时测试表
            String createSql = "CREATE TEMP TABLE test_connection (id SERIAL PRIMARY KEY, name VARCHAR(100))";
            try (PreparedStatement createStmt = connection.prepareStatement(createSql)) {
                createStmt.execute();
                System.out.println("✅ 临时测试表创建成功!");
            }
            
            // 插入测试数据
            String insertSql = "INSERT INTO test_connection (name) VALUES (?)";
            try (PreparedStatement insertStmt = connection.prepareStatement(insertSql)) {
                insertStmt.setString(1, "测试数据");
                int rowsAffected = insertStmt.executeUpdate();
                assertEquals(1, rowsAffected, "应该插入1行数据");
                System.out.println("✅ 测试数据插入成功!");
            }
            
            // 查询测试数据
            String selectSql = "SELECT id, name FROM test_connection";
            try (PreparedStatement selectStmt = connection.prepareStatement(selectSql);
                 ResultSet rs = selectStmt.executeQuery()) {
                
                if (rs.next()) {
                    int id = rs.getInt("id");
                    String name = rs.getString("name");
                    assertEquals("测试数据", name, "查询到的数据应该匹配");
                    System.out.println("✅ 测试数据查询成功! ID: " + id + ", Name: " + name);
                } else {
                    fail("应该能查询到插入的数据");
                }
            }
            
        } catch (SQLException e) {
            System.err.println("❌ 测试表操作失败: " + e.getMessage());
            e.printStackTrace();
            fail("测试表操作失败: " + e.getMessage());
        }
    }
}