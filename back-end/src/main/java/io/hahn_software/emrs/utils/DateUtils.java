package io.hahn_software.emrs.utils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Date;

public class DateUtils {

    /** Converts java.util.Date to epoch millis Long */
    public static Long dateToLong(Date date) {
        return (date == null) ? null : date.getTime();
    }


    /** Converts epoch millis Long to java.util.Date */
    public static Date longToDate(Long timestamp) {
        return (timestamp == null) ? null : new Date(timestamp);
    }


    // -------- java.time.Instant <-> Long --------

    /** Converts Instant to epoch millis Long */
    public static Long instantToLong(Instant instant) {
        return (instant == null) ? null : instant.getEpochSecond();
    }

    /** Converts epoch millis Long to Instant */
    public static Instant longToInstant(Long timestamp) {
        return (timestamp == null) ? null : Instant.ofEpochMilli(timestamp);
    }
    


    // -------- java.time.LocalDate <-> Long --------

    /**
     * Converts LocalDate to epoch millis Long at start of day UTC
     */
    public static Long localDateToLong(LocalDate localDate) {
        return (localDate == null) ? null : localDate.atStartOfDay(ZoneOffset.UTC).toEpochSecond();
    }

    /**
     * Converts epoch millis Long to LocalDate at UTC timezone
     */
    public static LocalDate longToLocalDate(Long timestamp) {
        return (timestamp == null) ? null : Instant.ofEpochMilli(timestamp).atZone(ZoneOffset.UTC).toLocalDate();
    }
}
