<script setup>
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'

import {
  businessProfile,
  saveBusinessProfile,
  resetBusinessProfile
} from '../../composables/useBusinessProfile'

const businessTypes = [
  'Coffee Shop',
  'Milk Tea Shop',
  'Restaurant',
  'Silog / Carinderia',
  'Bakery',
  'Fast Casual',
  'Food Kiosk',
  'Other Food Business'
]

const handleLogoUpload = (event) => {
  const file = event.target.files?.[0]

  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    businessProfile.logo = reader.result
    saveBusinessProfile()
  }

  reader.readAsDataURL(file)
}

const removeLogo = () => {
  businessProfile.logo = ''
  saveBusinessProfile()
}
</script>

<template>
  <section class="business-profile-page">
    <div class="hero-card surface-card">
      <div>
        <span class="eyebrow">System Settings</span>
        <h1 class="page-title">Business Profile</h1>
        <p class="page-subtitle">
          Manage your store name, logo, branch details, contact information, and business identity.
        </p>
      </div>

      <div class="hero-actions">
        <Button label="Reset" icon="pi pi-refresh" severity="secondary" outlined @click="resetBusinessProfile" />
        <Button label="Save Changes" icon="pi pi-check" @click="saveBusinessProfile" />
      </div>
    </div>

    <section class="surface-card profile-card">
      <div class="card-header">
        <div>
          <h3>Business Identity</h3>
          <p>This information updates your sidebar and topbar automatically.</p>
        </div>
      </div>

      <div class="form-grid">
        <div class="field form-span">
          <label>Business Logo</label>

          <div class="logo-upload">
            <div class="logo-preview">
              <img
                v-if="businessProfile.logo"
                :src="businessProfile.logo"
                alt="Business logo"
              />
              <i v-else class="pi pi-image"></i>
            </div>

            <div class="logo-actions">
              <label class="upload-button">
                <i class="pi pi-upload"></i>
                Upload Logo
                <input type="file" accept="image/*" hidden @change="handleLogoUpload" />
              </label>

              <Button
                v-if="businessProfile.logo"
                label="Remove"
                icon="pi pi-trash"
                severity="danger"
                text
                @click="removeLogo"
              />
            </div>
          </div>
        </div>

        <div class="field">
          <label>Business Name</label>
          <InputText
            v-model="businessProfile.businessName"
            placeholder="Business name"
            @input="saveBusinessProfile"
          />
        </div>

        <div class="field">
          <label>Legal Name</label>
          <InputText
            v-model="businessProfile.legalName"
            placeholder="Registered business name"
            @input="saveBusinessProfile"
          />
        </div>

        <div class="field">
          <label>Business Type</label>
          <Select
            v-model="businessProfile.businessType"
            :options="businessTypes"
            placeholder="Select business type"
            @change="saveBusinessProfile"
          />
        </div>

        <div class="field">
          <label>Branch Name</label>
          <InputText
            v-model="businessProfile.branchName"
            placeholder="Main Branch"
            @input="saveBusinessProfile"
          />
        </div>

        <div class="field">
          <label>Owner / Manager</label>
          <InputText
            v-model="businessProfile.ownerName"
            placeholder="Owner name"
            @input="saveBusinessProfile"
          />
        </div>

        <div class="field">
          <label>Phone Number</label>
          <InputText
            v-model="businessProfile.phone"
            placeholder="Phone number"
            @input="saveBusinessProfile"
          />
        </div>

        <div class="field">
          <label>Email Address</label>
          <InputText
            v-model="businessProfile.email"
            placeholder="Email address"
            @input="saveBusinessProfile"
          />
        </div>

        <div class="field form-span">
          <label>Business Address</label>
          <Textarea
            v-model="businessProfile.address"
            rows="4"
            autoResize
            placeholder="Complete business address"
            @input="saveBusinessProfile"
          />
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.business-profile-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-card,
.profile-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  box-shadow:
    0 18px 42px rgba(15, 23, 42, 0.08),
    0 4px 12px rgba(15, 23, 42, 0.04);
}

.hero-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 30px;
  overflow: hidden;
  position: relative;
}

.hero-card::after {
  content: '';
  position: absolute;
  right: -80px;
  top: -110px;
  width: 260px;
  height: 260px;
  border-radius: 999px;
  background: rgba(79, 70, 229, 0.12);
}

.eyebrow {
  display: inline-flex;
  margin-bottom: 12px;
  color: #4f46e5;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1;
}

.profile-card {
  padding: 22px;
}

.card-header {
  margin-bottom: 18px;
}

.card-header h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1.05rem;
  font-weight: 900;
}

.card-header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.88rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-span {
  grid-column: span 2;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  color: #0f172a;
  font-size: 0.88rem;
  font-weight: 800;
}

.logo-upload {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-preview {
  display: grid;
  place-items: center;
  width: 86px;
  height: 86px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  overflow: hidden;
}

.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-preview i {
  color: #94a3b8;
  font-size: 1.8rem;
}

.logo-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  color: #334155;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
}

@media (max-width: 900px) {
  .hero-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .hero-actions :deep(.p-button) {
    flex: 1 1 160px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-span {
    grid-column: span 1;
  }

  .logo-upload {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>