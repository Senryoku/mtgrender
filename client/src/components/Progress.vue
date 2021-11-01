<template>
	<div class="progress">
		<div
			v-for="(task, idx) in tasks"
			:key="idx"
			class="task"
			:class="{
				'task-success': task.status === 'success',
				'task-fail': task.status === 'fail',
			}"
			@click="collapse(idx)"
		>
			<div class="task-name">
				<span v-if="task.status === 'success'" class="success">✓ </span>
				<span v-else-if="task.status === 'fail'" class="fail">✗ </span>
				<Spinner v-else /><span>{{ task.name }}</span>
			</div>
			<collapse-transition dimension="height">
				<div v-show="!task.collapsed">
					<div class="steps">
						<div
							v-for="(step, step_idx) in task.steps"
							:key="step_idx"
							class="step"
						>
							<span v-if="step.status === 'success'" class="success">✓</span>
							<span v-else-if="step.status === 'fail'" class="fail">✗</span>
							<Spinner v-else />
							<span>{{ step.name }}</span>
							<span v-html="display_progress(step.progress)"></span>
							<span v-show="step.start && step.end"
								>{{ step.end - step.start }}ms</span
							>
						</div>
					</div>
					<div v-if="task.message" class="message" :class="task.message.type">
						{{ task.message.text }}
					</div>
				</div>
			</collapse-transition>
		</div>
	</div>
</template>

<script lang="ts">
import CollapseTransition from "@ivanv/vue-collapse-transition/src/CollapseTransition.vue";

import Spinner from "./Spinner.vue";

export default {
	props: { defaulttasks: Array },
	components: { CollapseTransition, Spinner },
	data(inst) {
		return {
			tasks: inst.$props.defaulttasks ?? [],
		};
	},
	methods: {
		get_tasks() {
			return this.tasks;
		},
		// API
		push_task(task) {
			if (typeof task === "string") task = { name: task };
			if (!task.steps) task.steps = [];
			if (!task.status) task.status = null;
			if (!task.collapsed) task.collapsed = false;
			task.start = performance.now();
			this.tasks.push(task);
		},
		push_step(step) {
			if (typeof step === "string")
				step = { name: step, start: performance.now() };
			this.last_task.steps.push(step);
		},
		update_step(progress) {
			const task = this.last_task;
			if (task) {
				task.steps[task.steps.length - 1].progress = progress;
			} else console.warn("Call to update_step without a valid step.");
		},
		end_step(progress) {
			if (this.last_step) {
				if (progress) this.last_step.progress = progress;
				this.last_step.end = performance.now();
				this.last_step.status = "success";
			} else console.warn("Call to end_step without a valid step.");
		},
		fail_step(progress) {
			if (this.last_step) {
				if (progress) this.last_step.progress = progress;
				this.last_step.status = "fail";
			} else console.warn("Call to fail_step without a valid step.");
		},
		end_task(message) {
			if (this.last_task) {
				if (this.last_step) this.end_step();
				const lt = this.last_task;
				lt.status = "success";
				lt.end = performance.now();
				// Auto-collapse after 1sec.
				lt.pending_collapse = setTimeout(() => {
					lt.collapsed = true;
				}, 1000);
				if (message) lt.message = { type: "success", text: message };
			} else console.warn("Call to end_task without a valid task.");
		},
		fail_task(message) {
			if (this.last_task) {
				if (this.last_step) this.fail_step();
				this.last_task.status = "fail";
				if (message) this.last_task.message = { type: "error", text: message };
			} else console.warn("Call to fail_task without a valid task.");
		},
		// Internal
		collapse(idx) {
			if (this.tasks[idx].pending_collapse) {
				clearTimeout(this.tasks[idx].pending_collapse);
				this.tasks[idx].pending_collapse = undefined;
			}
			this.tasks[idx].collapsed = !this.tasks[idx].collapsed;
		},
		display_progress(progress) {
			if (!progress || typeof progress === "string") return progress;
			else if (progress.type === "percent")
				return `${progress.value}% <progress max="100" value="${progress.value}">${progress.value}</progress>`;
			else if (progress.type === "ratio")
				return `${progress.value}/${progress.max} <progress max="${progress.max}" value="${progress.value}">${progress.value}/${progress.max}</progress>`;
			return progress;
		},
	},
	computed: {
		last_task() {
			return this.tasks[this.tasks.length - 1];
		},
		last_step() {
			return this.last_task?.steps?.[this.last_task?.steps?.length - 1];
		},
	},
};
</script>

<style scoped>
.progress {
	display: flex;
	flex-direction: column;
	gap: 0.1em;
	text-align: left;
	min-width: 40vw;
}

.task {
	padding: 0.25em;
	padding-bottom: calc(0.25em + 4px);
	box-shadow: inset 0 -4px 4px 0px #fff8;
	background-color: #ddd;
}

.task-success {
	background-color: rgb(195, 218, 195);
	animation: task-pulse 1s 1;
	--pulse-color: 60, 133, 60;
}

.task-fail {
	background-color: rgb(218, 181, 181);
	animation: task-pulse 1s 1;
	--pulse-color: 133, 60, 60;
}

@keyframes task-pulse {
	0% {
		box-shadow: inset 0 -4px 4px 0px #fff8,
			0 0 0 0 rgba(var(--pulse-color), 0.4);
	}
	70% {
		box-shadow: inset 0 -4px 4px 0px #fff8,
			0 0 0 20px rgba(var(--pulse-color), 0);
	}
	100% {
		box-shadow: inset 0 -4px 4px 0px #fff8, 0 0 0 0 rgba(var(--pulse-color), 0);
	}
}

.task-name {
	display: flex;
	gap: 1em;
	font-size: 1.1em;
	margin: 0.5em;
}

.steps {
	margin-left: 3em;
	text-align: center;
	transition: height 0.25s ease;
}

.step {
	display: flex;
	gap: 1em;
}

.step > *:nth-child(1) {
	flex-basis: 1em;
}

.step > *:nth-child(2) {
	text-align: left;
}

.step > *:nth-child(3) {
	flex-grow: 1;
}

.success {
	color: green;
}

.fail,
.error {
	color: red;
}

.message {
	background-color: #fff;
	padding: 0.5em 1em;
	border-radius: 0.2em;
	margin-top: 1em;
}
</style>