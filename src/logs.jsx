import React, { useEffect, useState } from 'react'
import './inputbox.css' // reuse styles or create logs-specific css if preferred

// add commas to number string (moved from component body to avoid re-creation on each render)
const formatNumber = (n) => {
  if (!n && n !== 0) return ''
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function Logs({ date, logs }) {
  
  // 1. 선택된 '월'에 해당하는 내역만 필터링
  
  // 헤더의 date(Date 객체)에서 연도와 월을 추출 (e.g., "2025-11")
  const selectedYear = date.getFullYear()
  // getMonth()는 0부터 시작하므로 +1, padStart로 2자리 (e.g., '01', '09', '11')
  const selectedMonth = String(date.getMonth() + 1).padStart(2, '0')
  const selectedYearMonth = `${selectedYear}-${selectedMonth}` // "YYYY-MM" 형식

  // 전체 logs 배열에서 'YYYY-MM'이 일치하는 내역만 필터링
  // log.date는 "YYYY-MM-DD" 형식이므로 startsWith로 비교
  const filteredLogs = logs.filter(log => log.date.startsWith(selectedYearMonth))

  // 2. 필터링된 내역으로 통계 계산
  const totalCount = filteredLogs.length
  
  const totalIncome = filteredLogs.reduce((sum, log) => {
    return log.type === 'income' ? sum + log.amount : sum
  }, 0)
  
  const totalExpense = filteredLogs.reduce((sum, log) => {
    return log.type === 'expense' ? sum + log.amount : sum
  }, 0)

  // 3. 필터링된 내역이 없을 경우
  if (filteredLogs.length === 0) {
    return (
      <div style={{ padding: 16 }}>
        <h3>{selectedYear}년 {selectedMonth}월 내역</h3>
        <div style={{ padding: '20px 0', textAlign: 'center', color: '#888' }}>
          해당 월의 내역이 없습니다.
        </div>
      </div>
    )
  }

  // 4. 필터링된 내역 렌더링
    return (
      <div style={{ padding: 16 }}>
        <h3>{selectedYear}년 {selectedMonth}월 내역 (총 {totalCount}건)</h3>
        <div style={{ display: 'flex', gap: 20, margin: '10px 0' }}>
          <h4 style={{ margin: 0, color: '#2a9d8f' }}>
            수입: {formatNumber(totalIncome)}원
          </h4>
          <h4 style={{ margin: 0, color: '#d9534f' }}>
            지출: {formatNumber(totalExpense)}원
          </h4>
        </div>
      
        <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0 0' }}>
          {filteredLogs.map((l) => (
            <li key={l.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <div style={{ minWidth: 120, color: '#333' }}>
                  {l.date} ({/* 간단한 요일 표시 예시 - 필요시 구현 */}
                  {new Date(l.date).toLocaleDateString('ko-KR', { weekday: 'short' })}
                  )
                </div>
                <div style={{ fontWeight: 700, color: l.sign === '-' ? '#d9534f' : '#2a9d8f' }}>
                  {l.sign}{formatNumber(l.amount)}
                </div>
                <div style={{ color: '#666' }}>
                  {l.category}
                </div>
                <div style={{ marginLeft: 'auto', color: '#999' }}>
                  {l.payment}
                </div>
              </div>
              <div style={{ color: '#444', marginTop: 6, paddingLeft: 132 }}>
                {l.content}
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
}

export default Logs