<template>
<div>

<v-card-title>
  <v-spacer></v-spacer>

  <v-btn
    color="tertiary"
    text
    href="https://community.bistudio.com/wiki/server.cfg#Example_Configuration_File"			
    target="_blank"
  >
    <v-icon left>mdi-help-circle</v-icon> Aide
  </v-btn>

  <v-btn
    color="quaternary"
    text
    :loading="loadingReset"
    @click="reset()"	
  >
    <v-icon left>mdi-alert-circle</v-icon> Rétablir par défaut			
  </v-btn>

  <v-btn
    color="primary"
    text
    :loading="loadingUpdate"
    @click="update()"
  >
    <v-icon left>mdi-content-save</v-icon> Enregistrer la config
  </v-btn>
</v-card-title>

<v-divider></v-divider>

<v-expansion-panels 
	multiple
	accordion
  v-model="panels"
>
	<v-expansion-panel>
		<v-expansion-panel-header>
			<template v-slot:actions>
				<v-icon color="primary">$expand</v-icon>
			</template>
			Paramètres généraux
		</v-expansion-panel-header>
		<v-expansion-panel-content>
      <v-text-field
        v-model="serverConfig.hostname"
        filled
        label="Nom d'hôte"
        dense
        clearable
      ></v-text-field>

      <v-text-field
        v-model="serverConfig.password"
        filled
        label="Mot de passe"
        dense
        clearable
        class="mt-2"
      ></v-text-field>

      <v-row>
        <v-col>
          <v-text-field
            v-model="serverConfig.password_admin"
            filled
            label="Mot de passe admin"
            dense
            hint="Mot de passe utilisé pour se connecter en admin en jeu avec la commande /login"
            persistent-hint
            clearable
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="serverConfig.server_command_password"
            filled
            label="Mot de passe commande serveur"
            dense
            hint="Mot de passe utilisé par les scripts côté serveur pour exécuter des commandes admins"
            persistent-hint
            clearable
          ></v-text-field>
        </v-col>
      </v-row>

      <v-text-field
        v-model="serverConfig.max_players"
        filled
        label="Nombre maximum de joueurs"
        dense
        type="number"
        class="mt-2"
      ></v-text-field>

      <v-switch
        v-model="serverConfig.persistent"
        label="Persistant"
        color="primary"
        inset
        hint="La mission continue même si il n'y a aucun joueur sur le serveur"
        persistent-hint
      ></v-switch>  
		</v-expansion-panel-content>
	</v-expansion-panel>

	<v-expansion-panel>
		<v-expansion-panel-header>
			<template v-slot:actions>
				<v-icon color="primary">$expand</v-icon>
			</template>
			Message de bienvenue
		</v-expansion-panel-header>
		<v-expansion-panel-content>
      <v-textarea
        v-model="motd"
        filled
        label="Message du jour"
        clearable
        hint="Séparer les messages par un saut de ligne. Faite un saut de ligne vide pour augmenter l'interval entre les messages"
        persistent-hint
      ></v-textarea>

      <v-text-field
        v-model="serverConfig.motd_interval"
        filled
        label="Interval de temps entre les messages"
        dense
        hint="En secondes"
        persistent-hint
        type="number"
        class="mt-2"
      ></v-text-field>
		</v-expansion-panel-content>
	</v-expansion-panel>

	<v-expansion-panel>
		<v-expansion-panel-header>
			<template v-slot:actions>
				<v-icon color="primary">$expand</v-icon>
			</template>
			Sécurité
		</v-expansion-panel-header>
		<v-expansion-panel-content>
      <v-switch
        v-model="serverConfig.battleye"
        label="BattlEye"
        color="primary"
        inset
      ></v-switch>

      <v-switch
        v-model="serverConfig.kick_duplicate"
        label="Kick les joueurs ayant le même ID (kickDuplicate)"
        color="primary"
        inset
      ></v-switch>

      <p>Vérification des signatures</p>
      <v-radio-group 
        v-model="serverConfig.verify_signatures" 
        row
      >
        <v-radio 
          label="Désactiver" 
          :value="0"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Signatures V2 mais accepte les V1" 
          :value="1"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Accepte seulement les V2" 
          :value="2"
          color="primary"
        ></v-radio>
      </v-radio-group>

      <p>Autoriser le file patching</p>
      <v-radio-group 
        v-model="serverConfig.allowed_file_patching" 
        row
      >
        <v-radio 
          label="Ne pas autoriser" 
          :value="0"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Autoriser Headless Client" 
          :value="1"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Autoriser" 
          :value="2"
          color="primary"
        ></v-radio>
      </v-radio-group>
		</v-expansion-panel-content>
	</v-expansion-panel>

  <v-expansion-panel>
		<v-expansion-panel-header>
			<template v-slot:actions>
				<v-icon color="primary">$expand</v-icon>
			</template>
			Vote
		</v-expansion-panel-header>
		<v-expansion-panel-content>
      <v-row>
        <v-col>
          <v-text-field
            v-model="serverConfig.vote_mission_players"
            filled
            label="Minimum joueurs pour afficher missions"
            dense
            type="number"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="serverConfig.vote_threshold"
            filled
            label="Pourcentage de vote"
            dense
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
		</v-expansion-panel-content>
	</v-expansion-panel>

  <v-expansion-panel>
		<v-expansion-panel-header>
			<template v-slot:actions>
				<v-icon color="primary">$expand</v-icon>
			</template>
			Chat vocal
		</v-expansion-panel-header>
		<v-expansion-panel-content>
      <v-switch
        v-model="serverConfig.disable_von"
        label="Désactiver le chat vocal"
        color="primary"
        inset
      ></v-switch>

      <p>Codec pour chat vocal</p>
      <v-radio-group 
        v-model="serverConfig.von_codec" 
        row
      >
        <v-radio 
          label="IETF standard OPUS codec" 
          :value="0"
          color="primary"
        ></v-radio>
        <v-radio 
          label="SPEEX codec" 
          :value="1"
          color="primary"
        ></v-radio>
      </v-radio-group>

      <v-text-field
        v-model="serverConfig.von_codec_quality"
        filled
        label="Qualité du codec pour chat vocal"
        dense
        type="number"
      ></v-text-field>
		</v-expansion-panel-content>
	</v-expansion-panel>

  <v-expansion-panel>
		<v-expansion-panel-header>
			<template v-slot:actions>
				<v-icon color="primary">$expand</v-icon>
			</template>
			Paramètres serveur
		</v-expansion-panel-header>
		<v-expansion-panel-content>
      <p>Format horaire des logs</p>
      <v-radio-group 
        v-model="serverConfig.timestamp_format" 
        row
      >
        <v-radio 
          label="Aucun" 
          value="none"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Court" 
          value="short"
          color="primary"
        ></v-radio>
        <v-radio 
          label="Complet" 
          value="full"
          color="primary"
        ></v-radio>
      </v-radio-group>

      <v-slider
        v-model="serverConfig.disconnect_timeout"
        :thumb-size="24"
        thumb-label="always"
        min="5"
        max="90"
        label="Délai de déconnexion"
        class="mt-7"
      ></v-slider>     

      <v-row>
        <v-col>
          <v-text-field
            v-model="serverConfig.max_desync"
            filled
            label="Désync max"
            type="number"
            dense
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="serverConfig.max_ping"
            filled
            label="Ping max"
            type="number"
            dense
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="serverConfig.max_packet_loss"
            filled
            label="Max paquets perdus"
            type="number"
            dense
          ></v-text-field>
        </v-col>
      </v-row>         
		</v-expansion-panel-content>
	</v-expansion-panel>

  <v-expansion-panel>
		<v-expansion-panel-header>
			<template v-slot:actions>
				<v-icon color="primary">$expand</v-icon>
			</template>
			Evènements
		</v-expansion-panel-header>
		<v-expansion-panel-content>
      <v-text-field
        v-model="serverConfig.on_user_connected"
        filled
        label="onUserConnected"
        dense
        clearable
      ></v-text-field>

      <v-text-field
        v-model="serverConfig.on_user_disconnected"
        filled
        label="onUserDisconnected"
        dense
        clearable
      ></v-text-field>

      <v-text-field
        v-model="serverConfig.double_id_detected"
        filled
        label="doubleIdDetected"
        dense
        clearable
      ></v-text-field>

      <v-text-field
        v-model="serverConfig.on_unsigned_data"
        filled
        label="onUnsignedData"
        dense
        clearable
      ></v-text-field>

      <v-text-field
        v-model="serverConfig.on_hacked_data"
        filled
        label="onHackedData"
        dense
        clearable
      ></v-text-field>

      <v-text-field
        v-model="serverConfig.on_different_data"
        filled
        label="onDifferentData"
        dense
        clearable
      ></v-text-field>
		</v-expansion-panel-content>
	</v-expansion-panel>
</v-expansion-panels>

</div>
</template>

<script>
export default {
	props: ['serverConfig'],

	data () {
		return {
      panels: [0, 1, 2, 3, 4, 5, 6],
			loadingUpdate: false,
			loadingReset: false
		}
	},

  computed: {
    motd () {
      return this.serverConfig.motd ? this.serverConfig.motd.split(';').join('\n') : ''
    }
  },

	methods: {
		async update () {
      this.loadingUpdate = true
      
      this.serverConfig.motd = this.serverConfig.motd ? this.serverConfig.motd.split('\n').join(';') : ''
      const response = await this.$axios.$put(`server/config/${this.serverConfig.id}`, this.serverConfig)      
      
      this.$toast.global.appSuccess('Config mise à jour')
			
			this.loadingUpdate = false			
		},

		async reset () {
      this.loadingReset = true
      
      const response = await this.$axios.$delete(`server/config/${this.serverConfig.id}`)

      this.$emit('update', { component: 'config', data: response })
      this.$toast.global.appSuccess('Config remise par défaut')

			this.loadingReset = false
		}
	}
}
</script>