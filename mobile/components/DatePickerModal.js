import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  ScrollView,
  Dimensions
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Custom Chevron Icons for Month Nav
const ChevronLeftIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const ChevronRightIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#03254C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DatePickerModal({ 
  visible, 
  onClose, 
  onSelect, 
  currentValue 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null); // 0-indexed
  const [selectedYear, setSelectedYear] = useState(null);
  
  // Picker Modes: 'calendar' | 'year' | 'month'
  const [pickerMode, setPickerMode] = useState('calendar');

  // Year range (usually birth dates go backward, future dates slightly forward)
  const currentSystemYear = new Date().getFullYear();
  const startYear = currentSystemYear - 100;
  const endYear = currentSystemYear + 10;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i).reverse();

  useEffect(() => {
    // Parse current value if it exists and is formatted as DD/MM/YYYY
    if (visible) {
      setPickerMode('calendar');
      let initialDate = new Date();
      if (currentValue && currentValue.length === 10) {
        const parts = currentValue.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // 0-indexed
          const year = parseInt(parts[2], 10);
          const parsed = new Date(year, month, day);
          if (!isNaN(parsed.getTime())) {
            initialDate = parsed;
          }
        }
      }
      
      setCurrentDate(initialDate);
      setSelectedDay(initialDate.getDate());
      setSelectedMonth(initialDate.getMonth());
      setSelectedYear(initialDate.getFullYear());
    }
  }, [visible, currentValue]);

  // Calendar Math
  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

  const handlePrevMonth = () => {
    let nextMonth = selectedMonth - 1;
    let nextYear = selectedYear;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    }
    setSelectedMonth(nextMonth);
    setSelectedYear(nextYear);
    setSelectedDay(null); // reset day selection on month change
  };

  const handleNextMonth = () => {
    let nextMonth = selectedMonth + 1;
    let nextYear = selectedYear;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    setSelectedMonth(nextMonth);
    setSelectedYear(nextYear);
    setSelectedDay(null); // reset day selection on month change
  };

  const handleSelectDay = (day) => {
    setSelectedDay(day);
  };

  const handleConfirm = () => {
    if (selectedDay && selectedMonth !== null && selectedYear) {
      const formattedDay = String(selectedDay).padStart(2, '0');
      const formattedMonth = String(selectedMonth + 1).padStart(2, '0');
      const formattedYear = selectedYear;
      onSelect(`${formattedDay}/${formattedMonth}/${formattedYear}`);
      onClose();
    }
  };

  // Render Calendar Grid
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDayIndex = getFirstDayOfMonth(selectedMonth, selectedYear);
    
    const dayCells = [];
    
    // Empty padding for start of month
    for (let i = 0; i < firstDayIndex; i++) {
      dayCells.push(<View key={`empty-${i}`} style={styles.calendarDayCellEmpty} />);
    }
    
    // Days in month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDay === day;
      const isToday = 
        day === new Date().getDate() && 
        selectedMonth === new Date().getMonth() && 
        selectedYear === new Date().getFullYear();

      dayCells.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[
            styles.calendarDayCell,
            isSelected && styles.selectedDayCell,
            isToday && !isSelected && styles.todayCell
          ]}
          onPress={() => handleSelectDay(day)}
        >
          <Text style={[
            styles.calendarDayText,
            isSelected && styles.selectedDayText,
            isToday && !isSelected && styles.todayText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        {/* Day of Week Headers */}
        <View style={styles.weekDaysRow}>
          {WEEK_DAYS.map((day) => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>
        
        {/* Days Grid */}
        <View style={styles.daysGrid}>
          {dayCells}
        </View>
      </View>
    );
  };

  // Render Year Picker
  const renderYearPicker = () => {
    return (
      <View style={styles.selectorContainer}>
        <FlatList
          data={years}
          keyExtractor={(item) => item.toString()}
          initialScrollIndex={years.indexOf(selectedYear) > -1 ? Math.max(0, years.indexOf(selectedYear) - 3) : 0}
          getItemLayout={(data, index) => (
            {length: 50, offset: 50 * index, index}
          )}
          renderItem={({ item }) => {
            const isSelected = item === selectedYear;
            return (
              <TouchableOpacity
                style={[styles.selectorItem, isSelected && styles.selectorItemSelected]}
                onPress={() => {
                  setSelectedYear(item);
                  setPickerMode('calendar');
                }}
              >
                <Text style={[styles.selectorItemText, isSelected && styles.selectorItemTextSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  // Render Month Picker
  const renderMonthPicker = () => {
    return (
      <View style={styles.selectorContainer}>
        <FlatList
          data={MONTH_NAMES}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const isSelected = index === selectedMonth;
            return (
              <TouchableOpacity
                style={[styles.selectorItem, isSelected && styles.selectorItemSelected]}
                onPress={() => {
                  setSelectedMonth(index);
                  setPickerMode('calendar');
                }}
              >
                <Text style={[styles.selectorItemText, isSelected && styles.selectorItemTextSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentCard}>
          
          {/* Header with selected date summary */}
          <View style={styles.headerBanner}>
            <Text style={styles.headerYearText}>{selectedYear}</Text>
            <Text style={styles.headerDateText}>
              {selectedDay ? `${String(selectedDay).padStart(2, '0')} ` : ''}
              {selectedMonth !== null ? MONTH_NAMES[selectedMonth].slice(0, 3) : ''}
            </Text>
          </View>

          {/* Navigation & Title Row */}
          {pickerMode === 'calendar' ? (
            <View style={styles.navRow}>
              <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                <ChevronLeftIcon />
              </TouchableOpacity>
              
              <View style={styles.headerTitlesRow}>
                <TouchableOpacity onPress={() => setPickerMode('month')}>
                  <Text style={styles.monthHeaderTitle}>{MONTH_NAMES[selectedMonth]}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPickerMode('year')}>
                  <Text style={styles.yearHeaderTitle}>{selectedYear}</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                <ChevronRightIcon />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.navRow}>
              <Text style={styles.selectorModeTitle}>
                Select {pickerMode === 'year' ? 'Year' : 'Month'}
              </Text>
              <TouchableOpacity onPress={() => setPickerMode('calendar')} style={styles.backToCalBtn}>
                <Text style={styles.backToCalBtnText}>Back</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Main Body */}
          <View style={styles.bodyContainer}>
            {pickerMode === 'calendar' && renderCalendar()}
            {pickerMode === 'year' && renderYearPicker()}
            {pickerMode === 'month' && renderMonthPicker()}
          </View>

          {/* Footer Actions */}
          <View style={styles.footerRow}>
            <TouchableOpacity onPress={onClose} style={styles.actionBtnCancel}>
              <Text style={styles.actionBtnTextCancel}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleConfirm} 
              style={[styles.actionBtnConfirm, !selectedDay && styles.actionBtnConfirmDisabled]}
              disabled={!selectedDay}
            >
              <Text style={styles.actionBtnTextConfirm}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 37, 76, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentCard: {
    width: width * 0.88,
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#03254C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  headerBanner: {
    backgroundColor: '#03254C',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  headerYearText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerDateText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitlesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#03254C',
  },
  yearHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A52C5',
    backgroundColor: '#E6EEFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  selectorModeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#03254C',
    paddingLeft: 8,
  },
  backToCalBtn: {
    backgroundColor: '#E6EEFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backToCalBtnText: {
    color: '#0A52C5',
    fontWeight: '800',
    fontSize: 12,
  },
  bodyContainer: {
    paddingHorizontal: 16,
    height: 250,
    justifyContent: 'center',
  },
  calendarContainer: {
    width: '100%',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDayCell: {
    width: '14.28%',
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  calendarDayCellEmpty: {
    width: '14.28%',
    height: 34,
  },
  calendarDayText: {
    fontSize: 13.5,
    color: '#334155',
    fontWeight: '700',
  },
  selectedDayCell: {
    backgroundColor: '#0A52C5',
    borderRadius: 17,
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  todayCell: {
    borderWidth: 1.5,
    borderColor: '#03254C',
    borderRadius: 17,
  },
  todayText: {
    color: '#03254C',
    fontWeight: '800',
  },
  selectorContainer: {
    flex: 1,
    marginVertical: 8,
  },
  selectorItem: {
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  selectorItemSelected: {
    backgroundColor: '#E6EEFF',
  },
  selectorItemText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  selectorItemTextSelected: {
    color: '#0A52C5',
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1.2,
    borderTopColor: '#F1F5F9',
  },
  actionBtnCancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },
  actionBtnTextCancel: {
    color: '#64748B',
    fontWeight: '800',
    fontSize: 13,
  },
  actionBtnConfirm: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#03254C',
  },
  actionBtnConfirmDisabled: {
    opacity: 0.5,
  },
  actionBtnTextConfirm: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
