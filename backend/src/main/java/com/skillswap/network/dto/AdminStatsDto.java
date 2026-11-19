package com.skillswap.network.dto;

public class AdminStatsDto {
    private long totalUsers;
    private long activeUsers;
    private long blockedUsers;
    private long activeSwapsThisMonth;
    private long completedSwapsTotal;
    private long pendingReports;
    private String disputeResolutionRate = "99.4%";

    public AdminStatsDto() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }

    public long getBlockedUsers() { return blockedUsers; }
    public void setBlockedUsers(long blockedUsers) { this.blockedUsers = blockedUsers; }

    public long getActiveSwapsThisMonth() { return activeSwapsThisMonth; }
    public void setActiveSwapsThisMonth(long activeSwapsThisMonth) { this.activeSwapsThisMonth = activeSwapsThisMonth; }

    public long getCompletedSwapsTotal() { return completedSwapsTotal; }
    public void setCompletedSwapsTotal(long completedSwapsTotal) { this.completedSwapsTotal = completedSwapsTotal; }

    public long getPendingReports() { return pendingReports; }
    public void setPendingReports(long pendingReports) { this.pendingReports = pendingReports; }

    public String getDisputeResolutionRate() { return disputeResolutionRate; }
    public void setDisputeResolutionRate(String disputeResolutionRate) { this.disputeResolutionRate = disputeResolutionRate; }
}
