<template>
<div>

<v-system-bar
	v-if="$store.state.downloadInfo.type"
	app
	fixed
	window
	color="grey darken-4"
>
	<v-container fluid>
		<v-row align="center" justify="center" column>
			<v-col class="text-truncate">
				<v-icon>mdi-download</v-icon>
				{{ $store.state.downloadInfo.title }}
			</v-col>

			<v-col>
				<v-progress-linear indeterminate></v-progress-linear>
			</v-col>

			<v-col>
				<v-btn
					text
					class="float-right"
					color="primary"
					@click="logsSheet = true"
				>
					<v-icon left color="primary">mdi-post</v-icon>Logs
				</v-btn>

				<v-btn
					text
					color="error"
					class="float-right"
					@click="cancel()"
					:loading="loadingCancel"
				>
					<v-icon left color="error">mdi-download-off</v-icon>Annuler
				</v-btn>								
			</v-col>         
		</v-row>
	</v-container>
</v-system-bar>

<v-bottom-sheet v-model="logsSheet" inset scrollable>
	<v-card>
		<v-card-actions>
			<v-btn
				class="mt-3"
				text
				color="error"
				block
				@click="logsSheet = !logsSheet"
			>
				Fermer
			</v-btn>
		</v-card-actions>
		
		<v-divider class="my-3"></v-divider>

		<v-card-text style="height: 300px;">
			<div v-for="log of $store.state.downloadInfo.logs" class="my-2">
				<kbd>{{ log }}</kbd>
			</div>
		</v-card-text>
	</v-card>
</v-bottom-sheet>  

</div>
</template>

<script>
export default {

	data () {
		return {
			logsSheet: false,
			loadingCancel: false
		}
	},

	methods: {
		async cancel () {
			this.loadingCancel = true 
				
			await this.$axios.$get('server/download/cancel')

			this.loadingCancel = false
		}
	}	
}
</script>