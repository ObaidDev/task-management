package io.hahn_software.emrs.utils;

import java.util.Map;
import java.util.UUID;

import org.hibernate.cfg.MultiTenancySettings;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import com.trackswiftly.utils.base.utils.TenantContext;


@Component
public class CurrentTenantIdentifierResolverImpl implements CurrentTenantIdentifierResolver<UUID> , HibernatePropertiesCustomizer{

    @Override
    public void customize(Map<String, Object> hibernateProperties) {
       hibernateProperties.put(MultiTenancySettings.MULTI_TENANT_IDENTIFIER_RESOLVER, this);
    }

    @Override
    public UUID resolveCurrentTenantIdentifier() {
        
        String tenantIdStr = TenantContext.getTenantId();
        if (!ObjectUtils.isEmpty(tenantIdStr)) {
            try {
                return UUID.fromString(tenantIdStr);
            } catch (IllegalArgumentException e) {
                // Handle invalid UUID format
                return UUID.nameUUIDFromBytes(tenantIdStr.getBytes());
            }
        } else {
            return UUID.nameUUIDFromBytes("BOOTSTRAP".getBytes());
        }
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
    
}
