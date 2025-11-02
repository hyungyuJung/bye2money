import React from 'react'
import './logs.css'

// add commas to number string (moved from component body to avoid re-creation on each render)
const formatNumber = (n) => {
  if (!n && n !== 0) return ''
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// format date (YYYY-MM-DD -> M월 D일 요일)
const formatDateForDisplay = (dateStr) => {
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

function Logs({ date, logs }) {
 
  // 1. 선택된 '월'에 해당하는 내역만 필터링
  const selectedYear = date.getFullYear()
  const selectedMonth = String(date.getMonth() + 1).padStart(2, '0')
  const selectedYearMonth = `${selectedYear}-${selectedMonth}` // "YYYY-MM" 형식

  const filteredLogs = logs.filter(log => log.date.startsWith(selectedYearMonth))

  // 2. 필터링된 내역으로 [월별] 통계 계산 (상단 요약용)
  const totalCount = filteredLogs.length
  const totalIncome = filteredLogs.reduce((sum, log) => 
    log.type === 'income' ? sum + log.amount : sum, 0)
  const totalExpense = filteredLogs.reduce((sum, log) => 
    log.type === 'expense' ? sum + log.amount : sum, 0)

  // 3. [요청] 정렬: 1. 날짜(date) 내림차순, 2. ID(id) 내림차순
  const sortedLogs = filteredLogs.sort((a, b) => {
    // 주 정렬 (날짜)
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    
    // 보조 정렬 (ID)
    if (a.id > b.id) return -1;
    if (a.id < b.id) return 1;

    return 0;
  });

  // 4. [요청] 일별 그룹화 및 [일별] 통계 계산
  const groupedLogs = sortedLogs.reduce((acc, log) => {
    const dateKey = log.date; // "YYYY-MM-DD"
    
    // 이 날짜의 그룹이 없으면 새로 생성
    if (!acc[dateKey]) {
      acc[dateKey] = {
        logs: [],
        dailyIncome: 0,
        dailyExpense: 0,
      };
    }
    
    // 로그 추가
    acc[dateKey].logs.push(log);
    
    // 일별 통계 계산
    if (log.type === 'income') {
      acc[dateKey].dailyIncome += log.amount;
    } else {
      acc[dateKey].dailyExpense += log.amount;
    }
    
    return acc;
  }, {}); // 초기값은 빈 객체

  // Object.entries는 { "2025-11-02": data, ... }를
  // [ ["2025-11-02", data], ... ] 배열로 변환
  const logGroups = Object.entries(groupedLogs);

  // 5. 렌더링
  
  // 내역이 없는 경우
  if (filteredLogs.length === 0) {
    return (
      <div className="logs-container">
        <h3>{selectedYear}년 {selectedMonth}월 내역</h3>
        <div className="no-logs-message">
          해당 월의 내역이 없습니다.
        </div>
      </div>
    )
  }

  // 내역이 있는 경우
  return (
    <div className="logs-container">
      {/* 1. 월별 요약 렌더링 */}
      <div className="monthly-summary">
        <div className="summary-item">
          <span className="summary-label">전체 내역</span>
          <span className="summary-value">{totalCount}건</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">총 수입</span>
          <span className="summary-value amount-income">
            {formatNumber(totalIncome)}원
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">총 지출</span>
          <span className="summary-value amount-expense">
            {formatNumber(totalExpense)}원
          </span>
        </div>
      </div>

      {/* 2. 일별 로그 그룹 렌더링 */}
      <div className="daily-log-list">
        {logGroups.map(([date, data]) => (
          <div key={date} className="daily-log-group">
            {/* 2-1. 일별 헤더 (날짜, 일별 총계) */}
            <div className="daily-header">
              <span className="daily-date">{formatDateForDisplay(date)}</span>
              <div className="daily-totals">
                {data.dailyIncome > 0 && (
                  <span className="amount-income">
                    수입 {formatNumber(data.dailyIncome)}원
                  </span>
                )}
                {data.dailyExpense > 0 && (
                  <span className="amount-expense">
                    지출 {formatNumber(data.dailyExpense)}원
                  </span>
                )}
              </div>
            </div>

            {/* 2-2. 개별 로그 항목 리스트 */}
            <ul className="log-item-list">
              {data.logs.map((log) => (
                <li key={log.id} className="log-item">
                  <span className="log-category">{log.category}</span>
                  <span className="log-content">{log.content}</span>
                  <span className="log-payment">{log.payment}</span>
                  <span className={`log-amount ${log.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                    {log.sign}{formatNumber(log.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Logs