<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="6">
          <div class="stats-card">
            <div class="stats-icon user">
              <i class="el-icon-user" />
            </div>
            <div class="stats-info">
              <p class="stats-number">{{ stats.totalUsers }}</p>
              <p class="stats-desc">总用户数</p>
              <p class="stats-change positive">
                <i class="el-icon-arrow-up" />
                <span>12.5%</span> 较上月
              </p>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <div class="stats-card">
            <div class="stats-icon product">
              <i class="el-icon-goods" />
            </div>
            <div class="stats-info">
              <p class="stats-number">{{ stats.totalProducts }}</p>
              <p class="stats-desc">总产品数</p>
              <p class="stats-change positive">
                <i class="el-icon-arrow-up" />
                <span>8.2%</span> 较上月
              </p>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <div class="stats-card">
            <div class="stats-icon order">
              <i class="el-icon-s-order" />
            </div>
            <div class="stats-info">
              <p class="stats-number">{{ stats.totalOrders }}</p>
              <p class="stats-desc">总订单数</p>
              <p class="stats-change negative">
                <i class="el-icon-arrow-down" />
                <span>3.1%</span> 较上月
              </p>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <div class="stats-card">
            <div class="stats-icon revenue">
              <i class="el-icon-money" />
            </div>
            <div class="stats-info">
              <p class="stats-number">¥{{ stats.totalRevenue }}</p>
              <p class="stats-desc">总收入</p>
              <p class="stats-change positive">
                <i class="el-icon-arrow-up" />
                <span>18.7%</span> 较上月
              </p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :xs="24" :lg="14">
          <div class="chart-card">
            <div class="chart-header">
              <h3>销售趋势</h3>
              <el-select v-model="salesPeriod" class="period-select" @change="fetchSalesTrend">
                <el-option label="近7天" value="week" />
                <el-option label="近30天" value="month" />
                <el-option label="近90天" value="quarter" />
                <el-option label="近1年" value="year" />
              </el-select>
            </div>
            <div class="chart-content">
              <div id="sales-chart" style="width: 100%; height: 350px;"></div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :lg="10">
          <div class="chart-card">
            <div class="chart-header">
              <h3>订单状态分布</h3>
            </div>
            <div class="chart-content">
              <div id="order-status-chart" style="width: 100%; height: 350px;"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 最近订单和热门产品 -->
    <div class="bottom-section">
      <el-row :gutter="20">
        <el-col :xs="24" :lg="14">
          <div class="chart-card">
            <div class="chart-header">
              <h3>最近订单</h3>
              <el-button type="text" @click="viewAllOrders">查看全部</el-button>
            </div>
            <div class="chart-content">
              <el-table :data="recentOrders" border :show-header="false" size="small">
                <el-table-column prop="orderNumber" label="订单号" />
                <el-table-column prop="totalAmount" label="金额">
                  <template #default="{ row }">
                    <span class="amount">¥{{ row.totalAmount }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                  <template #default="{ row }">
                    <el-tag :type="getStatusTagType(row.status)">
                      {{ getStatusText(row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <el-button type="text" @click="viewOrderDetail(row.id)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :lg="10">
          <div class="chart-card">
            <div class="chart-header">
              <h3>热门产品</h3>
              <el-button type="text" @click="viewAllProducts">查看全部</el-button>
            </div>
            <div class="chart-content">
              <div class="product-list">
                <div class="product-item" v-for="product in topProducts" :key="product.id">
                  <div class="product-rank">{{ product.rank }}</div>
                  <div class="product-info">
                    <p class="product-name">{{ product.name }}</p>
                    <p class="product-sales">销量: {{ product.sales }}</p>
                  </div>
                  <div class="product-revenue">¥{{ product.revenue }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as dashboardApi from '../../api/dashboard';

const router = useRouter();

const stats = ref({
  totalUsers: 1258,
  totalProducts: 342,
  totalOrders: 856,
  totalRevenue: 125689.50
});

const salesPeriod = ref('month');
const recentOrders = ref([]);
const topProducts = ref([]);

const fetchDashboardStats = async () => {
  try {
    const data = await dashboardApi.getDashboardStats();
    stats.value = data;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }
};

const fetchRecentOrders = async () => {
  try {
    const data = await dashboardApi.getRecentOrders(8);
    recentOrders.value = data;
  } catch (error) {
    console.error('Failed to fetch recent orders:', error);
  }
};

const fetchTopProducts = async () => {
  try {
    const data = await dashboardApi.getTopProducts(8);
    topProducts.value = data.map((product, index) => ({
      ...product,
      rank: index + 1
    }));
  } catch (error) {
    console.error('Failed to fetch top products:', error);
  }
};

const fetchSalesTrend = async () => {
  try {
    const data = await dashboardApi.getSalesTrend(salesPeriod.value);
    console.log('Sales trend data:', data);
    // 这里可以集成图表库渲染数据
  } catch (error) {
    console.error('Failed to fetch sales trend:', error);
  }
};

const getStatusText = (status) => {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    delivered: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status] || status;
};

const getStatusTagType = (status) => {
  const typeMap = {
    pending: 'warning',
    paid: 'primary',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger'
  };
  return typeMap[status] || 'info';
};

const viewOrderDetail = (id) => {
  router.push(`/orders/${id}`);
};

const viewAllOrders = () => {
  router.push('/orders');
};

const viewAllProducts = () => {
  router.push('/products');
};

onMounted(() => {
  fetchDashboardStats();
  fetchRecentOrders();
  fetchTopProducts();
  fetchSalesTrend();
});
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stats-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 20px;
}

.stats-icon.user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.stats-icon.product {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
}

.stats-icon.order {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.stats-icon.revenue {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
}

.stats-info {
  flex: 1;
}

.stats-number {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 5px 0;
}

.stats-desc {
  font-size: 14px;
  color: #999;
  margin: 0 0 8px 0;
}

.stats-change {
  font-size: 12px;
  margin: 0;
}

.stats-change.positive {
  color: #67c23a;
}

.stats-change.negative {
  color: #f56c6c;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.period-select {
  width: 120px;
}

.chart-content {
  position: relative;
}

.bottom-section {
  margin-bottom: 20px;
}

.amount {
  font-weight: bold;
  color: #67c23a;
}

.product-list {
  padding: 0;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f5f7fa;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-right: 12px;
}

.product-item:nth-child(1) .product-rank {
  background: #ffd700;
  color: #fff;
}

.product-item:nth-child(2) .product-rank {
  background: #c0c0c0;
  color: #fff;
}

.product-item:nth-child(3) .product-rank {
  background: #cd7f32;
  color: #fff;
}

.product-info {
  flex: 1;
}

.product-name {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
}

.product-sales {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.product-revenue {
  font-size: 14px;
  font-weight: bold;
  color: #67c23a;
}
</style>